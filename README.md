Laboratory Work No. 7: DOM Manipulation – Kanban Board
Course: Web Programming and Web Design
University: Kherson National Technical University
Faculty: Information Technologies and Design
Department: Software and Technologies
Group: 2PR1
Author: O.O. Korniienko
Instructor: O.S. Komisarov
Year: 2026

Project Description
This laboratory work focuses on DOM Manipulation through the development of a fully functional Kanban Board web application. The project demonstrates dynamic control over web page structure using JavaScript's Document Object Model (DOM) API.

The Kanban Board is a task management tool that organizes tasks into three columns:

To Do (До виконання)

In Progress (В процесі)

Done (Виконано)

Key Features
Feature	Description
Add Tasks	Create new tasks with a title and select initial column
Drag & Drop	Move tasks between columns using HTML5 Drag-and-Drop API (completed tasks cannot be moved)
Edit Tasks	Double-click or click edit button to modify task text
Delete Tasks	Remove individual tasks with confirmation
Persistent Storage	All tasks are automatically saved to localStorage
Export to JSON	Download all tasks as a JSON backup file
Clear All Tasks	Remove all tasks with confirmation
Real-time Statistics	Display total tasks, completed tasks, progress percentage, and task counts per column
Technologies Used
HTML5 – Semantic markup

CSS3 – Flexbox, Grid, gradients, animations, responsive design

JavaScript (ES6+) – DOM API, events, classes, modules

FontAwesome 6 – Icons for better UI

localStorage API – Persistent data storage

HTML5 Drag-and-Drop API – Task movement between columns

Project Structure

lab7_kanban/
├── index.html          # Main HTML structure
├── style.css           # Styles and responsive design
├── app.js              # Application logic
└── README.md           # Documentation

How to Run
Clone the repository or download all three files (index.html, style.css, app.js) into the same folder.

Open index.html in any modern web browser (Chrome, Firefox, Edge, Safari).

No web server is required – the application runs entirely client-side.

Note: The application uses localStorage, so your tasks will persist even after closing the browser.

Usage Examples
Adding a Task
Type a task name in the input field (max 100 characters)

Select a column from the dropdown (To Do, In Progress, or Done)

Click Add Task or press Enter

Moving a Task
Click and hold a task card (except completed tasks)

Drag it to another column

Release to drop – the task status updates automatically

Editing a Task
Double-click on the task text, OR

Click the ✏️ edit button on the task card

Modify the text and press Enter or click outside

Deleting a Task
Click the 🗑️ delete button on the task card

Confirm deletion in the popup dialog

Exporting Data
Click Export Data (JSON) button

A file named kanban_backup_YYYY-MM-DDTHH-MM-SS.json will be downloaded

Clearing All Tasks
Click Clear All Tasks button

Confirm the action – all tasks will be permanently deleted

Screenshots
Initial State
Three columns display tasks. Statistics show total tasks, completed tasks, and progress percentage.

Drag & Drop
Tasks can be dragged between columns. The target column highlights with a gray background during dragging. Completed tasks cannot be dragged.

Editing a Task
Double-clicking a task converts the text into an editable input field. Changes are saved automatically.

JSON Export
Clicking the export button downloads a JSON file with all task data.

Implementation Details
DOM Manipulation Methods Used
Method	Usage in Project
getElementById()	Access input fields, buttons, and containers
querySelector()	Find individual elements
querySelectorAll()	Get all task cards or task lists
createElement()	Create task cards, buttons, inputs dynamically
append() / appendChild()	Add elements to DOM
remove()	Delete task cards
classList.add() / remove() / toggle()	Manage CSS classes for drag states
setAttribute()	Set draggable attribute and data attributes
Drag-and-Drop Events
Event	Purpose
dragstart	Store task ID, add dragging class, prevent dragging of completed tasks
dragend	Clean up global variables, remove drag styling
dragover	Allow drop with preventDefault()
drop	Determine target column and move task
dragenter / dragleave	Highlight target column during drag
Data Flow
User action → 2. Update tasks array → 3. Save to localStorage → 4. Re-render DOM → 5. Update statistics

The tasks array serves as the single source of truth. All DOM updates are derived from this array, ensuring data and interface stay synchronized.

Control Questions & Answers
1. What is DOM and what role does it play in JavaScript-HTML interaction? Describe DOM node types.
DOM (Document Object Model) is a programming interface that represents an HTML document as a tree of nodes in browser memory. When a browser loads a webpage, it builds this internal model where every tag, text fragment, and attribute becomes a separate object. JavaScript accesses this model, not the original HTML file, allowing real-time page modifications without reloading.

Main node types:

Element – Represents HTML tags (<div>, <button>, <span>, etc.). Most commonly manipulated.

Text – Contains plain text inside elements.

Attr – Represents element attributes (class, id, etc.).

Comment – HTML comments.

Document – Root node of the entire page.

DocumentFragment – Lightweight container for optimizing bulk insertions.

2. How does querySelector() differ from querySelectorAll()? What does each return when no matches are found?
Method	Returns	On no match
querySelector(selector)	First matching element or null	null
querySelectorAll(selector)	Static NodeList of all matching elements	Empty NodeList (length = 0)
querySelector() stops at the first match, while querySelectorAll() collects all matches. The NodeList from querySelectorAll() is not a real array – it lacks methods like map(), filter(), reduce(). Use Array.from() or spread operator [...nodeList] to convert.

3. Explain the difference between selectors #taskInput, .task-item, and ul li. When is each most appropriate?
Selector	Type	Best Use Case
#taskInput	ID selector	Accessing a unique element (fastest, most specific)
.task-item	Class selector	Getting a group of similar elements (task cards, buttons)
ul li	Descendant selector	Global styling for all list items (less specific, can affect unintended elements)
In the Kanban board, I use ID selectors for unique controls (input fields, buttons), class selectors for groups of task cards, and descendant selectors only when necessary.

4. What methods are used to insert an element into DOM? How does append() differ from appendChild()? What methods allow inserting an element before or after another?
Insertion methods:

append() – Accepts multiple arguments (nodes or strings), converts strings to text nodes

appendChild() – Accepts only one node argument, returns the appended node

prepend() – Inserts at the beginning of parent's children

before() – Inserts before the reference node

after() – Inserts after the reference node

insertBefore() – Older method, requires specifying parent

Key difference: append() can take multiple arguments including strings; appendChild() takes only one node and returns it.

5. What happens to a DOM element after calling element.remove()? Do event handlers disappear?
When remove() is called, the element is immediately removed from the document tree and disappears from the screen. However, the element object still exists in memory if referenced by a variable.

Event handlers attached directly to the removed element are garbage-collected. However, if event handlers were attached to a parent (event delegation), they remain because the parent still exists.

6. Describe all methods of the classList object. What does toggle() return and when is it useful?
Method	Description
add(class1, class2, ...)	Adds one or more classes
remove(class1, class2, ...)	Removes one or more classes
contains(class)	Returns true if class exists
replace(oldClass, newClass)	Replaces one class with another
toggle(class, [force])	Adds if missing, removes if present
toggle() return value: true if class was added, false if removed. The optional force parameter (boolean) forces add (true) or remove (false).

toggle() is ideal for checkboxes, theme switchers, and any UI element with two states.

7. What is the fundamental difference between innerHTML and createElement regarding security (XSS)? When is using innerHTML acceptable?
Security difference:

innerHTML parses the string as HTML. If user input contains <script> or malicious attributes, the code executes (XSS attack).

createElement + textContent treats everything as plain text. Special characters are displayed, not executed.

Safe use cases for innerHTML:

Inserting trusted, hardcoded HTML templates

After sanitizing user input with a library

When you fully control the data source

In my Kanban board, I use createElement for task cards (user input) and textContent for statistics (safe and fast).

8. What is a template literal? How does it differ from a regular string in JavaScript?
Template literals use backticks (`) instead of quotes and support:

Interpolation – ${expression} embeds variables and expressions

Multiline strings – line breaks are preserved without \n

Tagged templates – advanced feature for custom string processing

Example:

// Regular string (concatenation)
'Hello, ' + name + '! Today is ' + date;

// Template literal
`Hello, ${name}! Today is ${date}`;

9. Why does the tasks array update simultaneously with DOM changes in addTask()? What happens if synchronization is broken?
The tasks array is the single source of truth. Every DOM change is derived from this array. When adding a task:

Add task object to tasks array

Save to localStorage

Re-render DOM from tasks

Update statistics

If synchronization breaks:

DOM update without array update – Task appears but won't be saved or exported; disappears on page reload

Array update without DOM update – Task exists in data but user can't see it

This is why I always update the array first, then re-render the entire UI.

10. Explain the closure mechanism in the context of button handlers in addTask(). How does each button "know" which task it belongs to?
Closure allows a function to "remember" variables from its creation scope, even after the outer function finishes.

In createTaskCard(), when I create edit/delete buttons:

deleteBtn.addEventListener('click', () => deleteTask(task.id));

Each button captures its own task.id from the specific iteration where the card was created. This creates a separate closure for each task card. When clicked, JavaScript accesses that closure, retrieving the correct task ID without needing to search the DOM.

Without closures, I would need to store the ID in a data-id attribute and read it each time – a less elegant solution.

11. Why is the <script> tag placed at the end of <body>? What alternative exists for placing scripts in <head>?
Reason: When the browser encounters a <script> tag, it stops HTML parsing, downloads (if external), and executes the script. If the script accesses DOM elements that haven't been parsed yet, it returns null.

Alternatives:

defer attribute – Downloads immediately but executes after HTML parsing completes. Maintains execution order.

async attribute – Downloads and executes as soon as ready, without waiting for HTML parsing. No order guarantee.

Recommendation: For most applications, placing scripts at the end of <body> is simple and reliable. Use defer if you prefer keeping scripts in <head>.

12. What is a NodeList and how does it differ from an Array? How do you convert a NodeList to a real array?
NodeList is a collection returned by methods like querySelectorAll() and properties like childNodes.

Differences from Array:

NodeList lacks array methods (map(), filter(), reduce(), find())

NodeList has forEach() (modern browsers only)

NodeList can be live (auto-updates with DOM changes) or static (snapshot)

Conversion methods:

// Method 1: Array.from()
const arr = Array.from(nodeList);

// Method 2: Spread operator
const arr = [...nodeList];

// Method 3: Array.prototype.slice.call() (older)
const arr = Array.prototype.slice.call(nodeList);

n my Kanban board, I convert NodeList to array when I need to use map() or filter() on task cards.

Conclusion
During this laboratory work, I developed a complete Kanban Board application that became a practical platform for mastering fundamental DOM principles. The application runs entirely client-side using native JavaScript without external libraries, demonstrating deep understanding of how browsers represent HTML documents as object trees and how JavaScript interacts with this tree.

Key achievements:

Dynamic DOM creation – Used createElement, append, and remove to manage task cards

Drag-and-Drop implementation – Handled dragstart, dragover, drop events with visual feedback

Persistent storage – Implemented localStorage save/load with JSON serialization

Inline editing – Replaced text with input fields using dynamic DOM manipulation

Real-time statistics – Updated counts and percentages after every user action

Event delegation – Managed events efficiently across dynamic elements

Closures – Used closures to bind task IDs to button handlers

Challenges overcome:

Coordinating Drag-and-Drop with array updates to maintain synchronization

Preventing dragging of completed tasks with preventDefault()

Managing focus and blur events during inline editing

Creating a responsive layout that works on mobile devices

The skills gained form the foundation for learning modern JavaScript frameworks like React, Vue, or Angular, where similar principles (component-based architecture, state management, reactivity) are implemented at a higher abstraction level.

References
MDN Web Docs. Document Object Model (DOM).
https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model

MDN Web Docs. HTML Drag and Drop API.
https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API

MDN Web Docs. Window.localStorage.
https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

Flanagan D. JavaScript: The Definitive Guide. 7th ed. O'Reilly Media, 2020.

WHATWG. DOM Living Standard.
https://dom.spec.whatwg.org

The Modern JavaScript Tutorial.
https://javascript.info

Author
O.O. Korniienko
Student of group 2PR1
Kherson National Technical University

License
This project was created for educational purposes. Free use and modification are allowed.
