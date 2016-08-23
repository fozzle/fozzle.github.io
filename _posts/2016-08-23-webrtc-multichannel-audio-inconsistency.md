---
title: WebAudio, MediaStream, and WebRTC PeerConnection - Strange Cases
layout: post
---

My recent work has had me delving deep into the wild world of WebRTC, WebAudio, and canvas. WebRTC especially definitely feels like it has a ways to go before it's going to be stable. Here are two interesting quirks I thought I'd share to hopefully save a few hours for others.

Using audio track from WebRTC PeerConnection in WebAudio
--------------------------------------------------------

The following was run in Chrome v52 only.

So here's what we want. We're going to send audio/video over WebRTC as part of a MediaStream, split apart the audio/video tracks on the receiving end. Show the video, and run the audio track through WebAudio to apply effects, do analysis, whatever.

Here's how I thought it would go down:

```javascript
peerConnection.onaddstream = event => {
  const stream = event.stream;
  
  const videoStream = new MediaStream();
  const audioStream = new MediaStream();

  stream.getVideoTracks.forEach(t => videoStream.addTrack(t));
  stream.getAudioTracks.forEach(t => audioStream.addTrack(t));

  const audioCtx = new AudioContext();
  const audioSource = audioCtx.createMediaStreamSource(audioStream);
  // Apply audio transformations if neeeded
  audioSource.connect(audioCtx.destination); // Or your final AudioNode...

  video.srcObject = videoStream;

}
```

I expected this would work. However if you do it this way, you'll see the video but never hear the audio, even though you are piping it into the AudioContext destination. If you were to attach an analyser node, you wouldn't see any activity either. However if you were to add the audioStream to an HTML5 audio element, it would play! So the problem wasn't that the audio was getting lost along the way.


This was driving me crazy because I wanted to perform some audio transformations before outputting it! I tried all combinations and finally stumbled on something...if you assigned the audio stream to the html5 element, then suddenly your WebAudio pipeline would work too. So...

```html
<audio autoplay muted id="audio"></audio>
```

```javascript
// If this was added ALONG WITH createMediaStreamSource, you would indeed hear the stream through the WebAudio pipeline
const audioTag = document.getElementById('audio');
audioTag.srcObject = audioStream;
```

It seems strange to me that you must have a muted audio element to be able to run the stream through WebAudio! I don't believe this is ever mentioned anywhere, either...

Audio Channels for Audio Track sent over PeerConnection are merged in Chrome but not Firefox 
--------------------------------------------------------------------------------------------

Another baffling issue. Again, Chrome v52 showing unexpected behavior while Firefox v49 works as one would expect.

I was trying to send audio from the microphone through one audio channel, and the output of an oscillator through another. It seems to work fine on the senders side. You can easily generate audio with this characteristic.

```javascript
// Assume 'localStream' is a audio/video stream obtained from GetUserMedia
const newStream = new window.MediaStream();
const audioStreamNode = ac.createMediaStreamSource(localStream);
const audioStreamDestination = ac.createMediaStreamDestination();
const splitter = ac.createChannelSplitter(2);
const osc = ac.createOscillator();
osc.frequency.value = 150;
osc.start();
audioStreamNode.connect(splitter);
splitter.connect(merger, 0, 0);
osc.connect(merger, 0, 1);
merger.connect(audioStreamDestination);

const newAudioTrack = audioStreamDestination.stream.getAudioTracks()[0];
const videoTrack = localStream.getVideoTracks()[0];
newStream.addTrack(newAudioTrack);
newStream.addTrack(videoTrack); 

// Do PeerConnection song and dance...
peerConnection.addStream(newStream);
```

So what we have here, is our microphone being put into the left channel, and an oscillator being put into the right channel. Then we rebuild a stream, and add it to a PeerConnection to be sent to someone else. If you were to play the audio from the merger node, you would hear the distinct channels in each ear.

However, when you receive the audio, the channels are "blended" together. The left is present on the right, and vice versa.

Interestingly enough, this isn't the case on FF v49...as expected the audio channels remain as they were.

This is a fairly annoying case to reproduce, so you can use [this example](https://kpetrovi.ch/samples/src/content/peerconnection/webaudio-channels/) that I forked from a WebRTC demo repository.

I've filed a bug report [here](https://bugs.chromium.org/p/chromium/issues/detail?id=640286) in hopes that I could get some clarification on whether this was a bug or intended.

Welp
----

All I have to say in closing is: Best of luck to anyone else out there trying to make use of these cutting-edge APIs!
