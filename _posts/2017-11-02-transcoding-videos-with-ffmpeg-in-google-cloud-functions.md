---
layout: post
title: Transcoding Videos from Google Cloud Storage using FFMPEG in Google Cloud Functions
published: true
tags:
- video
- FFMPEG
- transcoding
- Google Cloud Functions
- Google Cloud
- Javascript
- node
type: post
---

## Disclaimer

The meat of this is from a [comment](https://codepen.io/positlabs/post/ffmpeg-in-google-cloud-functions#comment-id-6796) on [this blog post](https://codepen.io/positlabs/post/ffmpeg-in-google-cloud-functions) but I wanted to write a dedicated post about it because the blog post ends with an "impossible" conclusion but that isn't the case, if you are using GCS triggers and not multipart uploads. Hats off to sjurgis for the code!

## Glossary

GCS - Google Cloud Storage
GCF - Google Cloud Function

## Objective

When a video is uploaded to a certain GCS bucket, transcode the video and place it in another GCS bucket.

For my particular use case, I wanted to transcode video recorded by the [Media Recorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder), from WebM with H264/Opus to MP4 with H264/AAC. The idea being that MP4 with H264/AAC would be universally playable because *ahem*, Apple.

## Setup

You'll need the following APIs activated on Google Cloud: Storage, Cloud Functions.

You'll need to create two GCS buckets. One for user uploads, one for the final transcoded videos.

Your cloud function will have the following dependencies:

- [GCS](https://www.npmjs.com/package/@google-cloud/storage) - allows interfacing to GCS
- [FFMPEG Installer](https://www.npmjs.com/package/@ffmpeg-installer/ffmpeg) - makes FFMPEG available to use within GCF
- [Fluent FFMPEG](https://www.npmjs.com/package/fluent-ffmpeg) - makes working with FFMPEG in node easier, accepts streams as inputs

## The Code

This will live on a GCF that is triggered by the upload GCS bucket.

```javascript
const storage = require('@google-cloud/storage')();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');

const transcodedBucket = storage.bucket('transcode');
const uploadBucket = storage.bucket('upload');
ffmpeg.setFfmpegPath(ffmpegPath);

exports.transcodeVideo = function transcodeVideo(event, callback) {
  const file = event.data;

  // Ensure that you only proceed if the file is newly created, and exists.
  if (file.metageneration !== '1' || file.resourceState !== 'exists') {
    callback();
    return;
  }

  // Open write stream to new bucket, modify the filename as needed.
  const remoteWriteStream = transcodedBucket.file(file.name.replace('.webm', '.mp4'))
    .createWriteStream({
      metadata: {
        metadata: file.metadata, // You may not need this, my uploads have associated metadata
        contentType: 'video/mp4', // This could be whatever else you are transcoding to
      },
    });

  // Open read stream to our uploaded file
  const remoteReadStream = uploadBucket.file(file.name).createReadStream();

  // Transcode
  ffmpeg()
    .input(remoteReadStream)
    .outputOptions('-c:v copy') // Change these options to whatever suits your needs
    .outputOptions('-c:a aac')
    .outputOptions('-b:a 160k')
    .outputOptions('-f mp4')
    .outputOptions('-preset fast')
    .outputOptions('-movflags frag_keyframe+empty_moov') // This is interesting, https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/346#issuecomment-67299526
    .on('start', (cmdLine) => {
      console.log('Started ffmpeg with command:', cmdLine);
    })
    .on('end', () => {
      console.log('Successfully re-encoded video.');
      callback();
    })
    .on('error', (err, stdout, stderr) => {
      console.error('An error occured during encoding', err.message);
      console.error('stdout:', stdout);
      console.error('stderr:', stderr);
      callback(err);
    })
    .pipe(remoteWriteStream, { end: true }); // end: true, emit end event when readable stream ends
};
```

And yea, that's all! I've only tested it on a handful of videos so far but it seems to work nicely. You can have another GCF listening to the final transcoded bucket in case you need to do something else with the transcoded file. It's all pretty intuitive.

## Conclusion

Transcoding videos in GCF with FFMPEG is totally possible if the files are streamed from GCS. Just be careful of invoking overly long GCF processing times, it could be expensive. This setup makes for a flexible on-demand transcoding flow if you have a low volume side project and don't want to pay for dedicated servers to sit idle.
