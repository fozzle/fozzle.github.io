---
title: Multiline UIButton and Autolayout
layout: post
---

I ran into this issue at work where I had a UIButton that had variable text (due to localization). I set it to wrap, but as the UIButtonLabel grew the UIButton itself stayed the same size. This ended up causing the UIButtonLabel to overflow into other parts, despite having Autolayout spacing constraints to keep it apart.

My coworker made a suggestion to give the button a height constraint and modify the constraint based on the text. I took this idea and made it even simpler, using the height of the UIButtonLabel as a reference, as the UIButtonLabel already had the correct size.

I made height constraints on my buttons and created outlets from those constraints to my view controller. Finally I overrode updateViewConstraints with the following:

```objectivec
- (void)updateViewConstraints
{
    self.moderateButtonHeightConstraint.constant = self.moderateButton.titleLabel.frame.size.height;
    self.messageButtonHeightConstraint.constant = self.messageButton.titleLabel.frame.size.height;
    [super updateViewConstraints];
}
```

Simple, but took me an embarrassingly long time to arrive at. Now the buttons expand properly as their label changes based on localization settings.
