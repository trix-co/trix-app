# Animations

This UI kit provides several types of animations that are built on top of the [Animated API](https://facebook.github.io/react-native/docs/animations.html).
The list of animations that can be seen in the video below include:

* Fade-in view with delays, translations, and rotations
* Scrolling animation
* Loading effect
* Blur animation
* Text fade-in with translation

<iframe width="560" height="315" src="https://www.youtube.com/embed/XpfgJg-7RAI" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

On top of that, we provide a simple high-level API that makes simple animations even simpler.
Consider the animation below:

<video style="object-fit: cover; width: 300px;" autoPlay loop muted>
    <source src="images/fade-in-with-rotation.mp4" type="video/mp4" />
</video>

It is implemented as shown in the code snippet below.

```js
// @flow
import {AnimatedView, simpleInterpolation, directInterpolation} from "../components/Animations";

export default class Share extends React.Component<{}> {
    render(): React.Node {
        const frontAnimations = {
            opacity: directInterpolation(),
            transform: [{ rotate: simpleInterpolation("0deg", "-15deg") }]
        };
        const backAnimations = {
            opacity: directInterpolation(),
            transform: [{ rotate: simpleInterpolation("0deg", "15deg") }]
        };
        return (
            <View style={styles.container}>
                <AnimatedView
                    animations={frontAnimations}
                    style={[styles.picture, styles.frontPicture]}
                />
                <AnimatedView
                    animations={backAnimations}
                    style={[styles.picture, styles.backPicture]}
                />
            </View>
        );
    }
}
```

The `AnimatedView` component loads the animation on mount.
The component takes the following three properties.

* `animations` contains a list of CSS property names and an interpolation configuration for that property.
The default value is a simple fade-in effect: opacity goes up and the view that was originally translated to 20 pixels returns to original position:

```js
animations: {
    opacity: { inputRange: [0, 1], outputRange: [0, 1] },
    transform: [ { translateY: { inputRange: [0, 1], outputRange: [20, 0] } } ]
}
```

* `delay` contains the number of milliseconds to delay the start of the animation.

* `duration` is the total duration of the animation.
