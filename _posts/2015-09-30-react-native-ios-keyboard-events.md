---
layout: post
title: React Native iOS Keyboard Events
---

I’ve been fooling around a lot with React Native (specifically applied to iOS) lately, and it’s been a ton of fun. However there are some important bits and bobs that seem to be hidden away, at least from the main documentation.

One of these is the Device Event Emitter. The Device Event Emitter used to be something you acquired by requiring ‘RCTDeviceEventEmitter’ but now it lives on the main React object, so you can destructure it like so:

```javascript
let React = require(’react-native’);
let { DeviceEventEmitter } = React;
```

DeviceEventEmitter is just a [JS Event Emitter](https://github.com/facebook/emitter) that emits events for things like keyboard display, orientation shift, etc. You can attach listeners to it by using `addListener`, and do whatever you gotta do. In the case of this blog post, I needed to move my view up and down depending on whether or not the keyboard was being shown. Furthermore, I wanted to make it snazzy and animated.

So first off, what are the keyboard events called? For some reason it isn't documented, but I was able to figure out of it's existence through chatter in various issues on the react-native repository. You can find the [keyboard observer here...](https://github.com/facebook/react-native/blob/304989e3b8cec800bc42c7f7210bc286d5c0b4b0/React/Base/RCTKeyboardObserver.m). Sooooo, you can see we have `keyboardWillShow`, `keyboardDidShow`, `keyboardWillHide`, `keyboardDidHide`, `keyboardWillChangeFrame`, and `keyboardDidChangeFrame` at our disposal.

The ones I'm interested in are `keyboardWillShow` and `keyboardWillHide`, and I will move my view when these fire.

Attaching the listeners is easy, and should happen in your components `componentDidMount()` method.

```javascript
componentDidMount() {
  _keyboardWillShowSubscription = DeviceEventEmitter.addListener('keyboardWillShow', (e) => this._keyboardWillShow(e));
  _keyboardWillHideSubscription = DeviceEventEmitter.addListener('keyboardWillHide', (e) => this._keyboardWillHide(e));
}
```

Obviously you can call your handlers what you want. The event object contains some useful data about the state of the keyboard, so I recommend taking it in. Here's an example of what's in that event data:

```javascript
{ 
  endCoordinates: { 
    screenY: 442, 
    screenX: 0, 
    width: 375, 
    height: 225 
  },
  startCoordinates: { 
    screenY: 451, 
    screenX: 0, 
    width: 375, 
    height: 216 
  },
  duration: 250 
}
```

I concerned myself with the endCoordinates height, because if I offset my view by that much from the "bottom" then nothing will get obscured.

So let's backup and look at what the view looks like.

```javascript
<Animated.View style={[styles.container, {marginBottom: this.state.keyboardOffset}]}>
  <ListView
    style={styles.messageList}
    dataSource={this.state.dataSource}
    renderRow={this._renderRow.bind(this)}>
  </ListView>
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.textInput}
      multiline={false}
      autoFocus={false} />
    <Text style={styles.sendButton}>Send</Text>
  </View>
</Animated.View>
```

You can ignore the innards, the main point is we have a container view that is of the `Animated` variety. This allows us to animate it's movement. Let's setup a value to animate in our state.

```javascript
constructor(props) {
  super(props);
  this.state = {
    keyboardOffset: new Animated.Value(0);
  };
}
```

Ok so now we can animate the keyboardOffset value in our state, and our view's marginBottom will adjust in an animated fashion. So what do our keyboard event callbacks look like?

```javascript
_keyboardWillShow(e) {
  Animated.spring(this.state.keyboardOffset, {
    toValue: e.endCoordinates.height,
    friction: 6
  }).start();
}

_keyboardWillHide(e) {
  Animated.spring(this.state.keyboardOffset, {
    toValue: 0,
    friction: 6
  }).start();
}
```

Pretty straightforward eh? So you see we tell the keyboard offset to animate to the keyboard's destination height when the keyboard being shown, and to animate back to the baseline when the keyboard is being hidden.

One last thing, be sure to remove your event listeners when the component is destroyed, so that there are no memory leaks.

```javascript
componentWillUnmount() {
  _keyboardWillShowSubscription.remove();
  _keyboardWillHideSubscription.remove();
}
```

If all went to plan, you should have something like this:

![BOING](http://i.imgur.com/4ToXqZr.gif)

You can change the animation style however you want. If you use the `Animated.timing` function, try using the keyboard event duration to help you time it!

I'm not sure why the React-Native docs don't mention DeviceEventEmitter or keyboard handling, it's a common issue in iOS development. Luckily the capabilities are there and easy to work with, just gotta know where to look. :)
