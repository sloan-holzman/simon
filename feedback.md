# Project Feedback + Evaluation

| Score | Expectations |
|   --- | ---          |
|     0 | Incomplete   |
|     1 | Progressing  |
|     2 | Performing   |
|     3 | Excelling    |

Hey Sloan, your project is great, really great job!

## Deployment:

> Did you successfully deploy your project to github pages? Is the app's functionality the same deployed as it is locally?

Your Score: 3

## Technical Requirements:

> Did you deliver a project that met all the technical requirements? Given what the class has covered so far, did you build something that was reasonably complex?

Your Score: 3

You definitely met the technical requirements for the project, as well as the bonuses. Great to see some additional features you came up with by yourself! Next you could try integrating the project with [Firebase](https://firebase.google.com/) to integrate user authentication and a database to save high scores. Additionally, you could make it responsive or consider learning about SVGs for the game board.

You did meet all the technical requirements and the bonuses, I would have really liked to see you using a more object-oriented approach to your project. This would have been a really great opportunity to use classes.

## Code Quality:

> Did you follow code style guidance and best practices covered in class, such as spacing, modularity, and semantic naming? Did you comment your code?

Your Score: 3

Your work looks really great. Here are a couple of tips and things to keep in mind:
* Multi-word CSS classes should be separated with a hyphen, not made camel case - this is a bad practice. It may seem trivial, but I have worked somewhere where we turned down applicants and cited this as one of the reasons why. So instead of `highScoreTable`, you should use `high-score-table`
* I recommend you look into the class naming convention, BEM. You can read about it [here](https://css-tricks.com/bem-101/) and [here](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/). This is the industry standard for naming and grouping classes and for structuring elements. It would help improve the readability of your HTML & CSS and help you with structuring your styling. [This](https://github.com/sloan-holzman/simon/blob/gh-pages/index.html#L20-L29) part of your codebase would start to look like this:
```html
<div class="lights">
  <div class="lights__column">
    <div class="light"></div>
    <div class="light"></div>
  </div>
  <div class="lights__column">
    <div class="light"></div>
    <div class="light"></div>
  </div>
</div>
```
* Note that I also removed the ID selectors above, as a general rule you can have up to 3 IDs on a page but you should strive to never use them. I notice you're relying on them for your JavaScript, the best practice there is to use CSS classes prefixed with `js-`. So instead of `$(#start)`, you'd have `$(.js-start-button)` (I also recommend making these more specific and semantic).
* I notice you're relying pretty heavily on `<divs>`, this is pretty common for someone new to HTML. I want to challenge you to use more semantic elements instead, like [here](https://github.com/sloan-holzman/simon/blob/gh-pages/index.html#L16-L18) seems like a great place to use the `<header>` element. This is important because it'll make your websites more digestible for tools like screen readers (for the vision-impaired).
* The `<table>` element should be reserved for tables of data, [here](https://github.com/sloan-holzman/simon/blob/gh-pages/index.html#L58-L80), I think what you want is a `<form>`. Spend some time researching how to build forms because I think you can make this a lot cleaner and more semantic.
* It's best practice to delete "dead code", i.e. code that is commented out, as you have [here](https://github.com/sloan-holzman/simon/blob/gh-pages/css/controls.css#L26-L50)
* There is a lot you can research on CSS architecture. If you want to do a deep dive, research Atomic CSS, Object-Oriented CSS, and SMACSS. CSS Architecture is all about how you structure and organize your CSS and is a big discussion in front end development. Generally, you'll want to group styles together (you're `.button` styles are separated, for instance), organize your selectors hierarchically following the cascade (tags at the top, classes below and grouped by layout (i.e. `.wrapper`, `.row`, etc), component (i.e. `.button`) and skin (i.e. `.button--large`)).
* You should prefer to apply styles directly on an element, rather than create a class for it like you're doing [here](https://github.com/sloan-holzman/simon/blob/gh-pages/css/controls.css#L59) with your `.slider` class. Instead, target the `input[type=range]` and if you have different kinds of range inputs, you can create classes for those (like `input[type=range]` for your base range input styles, `.control-range` for a specific range input and `.volume-range`, for another specific range input)
* [This](https://github.com/sloan-holzman/simon/blob/gh-pages/js/script.js#L5-L8) data could probably go in a data-attribute. Then you can use `querySelectorAll`, which returns a NodeList (like an array). Going in that direction would help clean up your code a lot, especially [here](https://github.com/sloan-holzman/simon/blob/gh-pages/js/script.js#L147-L162) where you could use an array index
* You should consider using the Model/View pattern that Andy discussed at the beginning of the project as a way of organizing your code
* I want to challenge you to think more about your variable names. For instance, [here](https://github.com/sloan-holzman/simon/blob/gh-pages/js/script.js#L113), a better variable name might be `randomLightIndex`, `randomLight` implies you have a light DOM node when in fact this is an index for a random light DOM node.
* [This](https://github.com/sloan-holzman/simon/blob/gh-pages/js/script.js#L129) is really messy because you're mixing two actions in one line (incrementing the loop index and checking the loop index against the sequence length), which could lead to some weird results.

## Creativity/Interface:

> Is your user interface easy to use and understand? Does it make sense for the problem you're solving? Does your interface demonstrate creative design?
Your Score: 3

Your interface is great, really great job!

It looks like most of the work you've submitted is yours but that the styling for the toggles came from [this](http://callmenick.com/post/css-toggle-switch-examples) blog post by Nick Salloum. I want to remind you of GA's [plagiarism policy](https://git.generalassemb.ly/DC-WDI/wdi19/blob/master/plagiarism.md). Even though you changed some of the styles, without a proper citation this is considered plagiarism.

Going forward, please cite any work that you use in a homework, lab or project that is not yours.
