# Modern Interactive Calculator

## Live Demo
👉 https://fitria-lm.github.io/interactive-calculator/

## Preview
![Calculator Preview](preview.png)

A modern interactive calculator built with pure HTML, CSS, and Vanilla JavaScript.  
Supports basic and advanced mathematical operations with a responsive and intuitive user interface.

---

## Features

### 1. Mathematical Operations
- Basic operations: `+`, `-`, `×`, `÷`
- Percentage (`%`) and positive/negative toggle (`±`)
- Complex expression evaluation with parentheses and operator precedence
- Example: `3 + (4 × 2) / 7` is calculated correctly

### 2. UI/UX Features
- **Light / Dark Mode** – Toggle between light and dark themes
- **History Panel** – Stores the last 10 calculations
- **Responsive Design** – Optimized for desktop and mobile
- **Smooth Animations** – Subtle transitions and hover effects
- **Modern Color Scheme** – Clean and visually appealing layout

### 3. Technical Features
- **LocalStorage** – Saves theme preferences and calculation history
- **Keyboard Support** – Full keyboard input support
- **Event Delegation** – Efficient event handling
- **Error Handling** – Robust handling of invalid input and errors

### 4. Bonus Features
- **Scientific Functions** – `sin`, `cos`, `tan`, `log`, `√`, `x²`
- **Memory Functions** – `M+`, `M-`, `MR`, `MC`
- **Copy to Clipboard** – Copy calculation results easily
- **Export / Import History** – Save and load history as JSON

---

## Installation and Usage

### Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional)

### Steps

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/username/modern-interactive-calculator.git
````

2. **Navigate to the project folder**

   ```bash
   cd modern-interactive-calculator
   ```

3. **Run the application**

   * Open `index.html` directly in your browser
   * Or use a local web server:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx http-server
   ```

4. **Access the app**

   * `http://localhost:8000` (if using a local server)
   * Or simply open `index.html`

---

## Project Structure

```text
modern-interactive-calculator/
├── index.html          # Main HTML structure
├── style.css           # All CSS styling
├── script.js           # JavaScript logic
└── README.md           # Project documentation
```

---

## Built With

* **HTML5** – Semantic structure
* **CSS3** – CSS Variables, Flexbox, Grid
* **Vanilla JavaScript** – No frameworks or external libraries
* **Font Awesome** – Icons (via CDN)
* **Google Fonts** – Poppins font (via CDN)

---

## Live Demo

Click here to view the live demo

---

## Testing Checklist

### Mathematical Test Cases

* `2 + 3 × 4 = 14` (operator precedence)
* `(2 + 3) × 4 = 20` (parentheses support)
* `5 ÷ 0 = Error` (division by zero handling)
* `0.1 + 0.2 = 0.3` (floating-point precision)
* `10% = 0.1` (percentage)
* `-5 + 3 = -2` (negative numbers)

### UI/UX Test Cases

* Responsive on desktop and mobile
* Light/dark theme toggle works
* History panel opens and closes properly
* Keyboard input supported
* Smooth button animations

### Error Handling Test Cases

* Prevents duplicate operators (`++`, `--`, `××`)
* Prevents multiple decimal points
* Input length validation (max 20 characters)
* Handles invalid expressions gracefully

---

## Feature Details

### 1. Expression Evaluation

Uses the **Shunting Yard Algorithm** to convert infix expressions to postfix notation and evaluate them correctly based on operator precedence.

### 2. History Management

* Stores up to 10 recent calculations
* Clickable history entries to reuse calculations
* Export and import history as JSON
* Persisted using localStorage

### 3. Memory Functions

* **MC** – Clear memory
* **MR** – Recall memory
* **M+** – Add to memory
* **M-** – Subtract from memory

### 4. Scientific Mode

* Square root (`√`)
* Square power (`x²`)
* Trigonometric functions (`sin`, `cos`, `tan`)
* Logarithmic function (`log`)

---

## Keyboard Shortcuts

| Key             | Function      |
| --------------- | ------------- |
| 0–9             | Numbers       |
| + - * /         | Operators     |
| .               | Decimal point |
| Enter / =       | Calculate     |
| Escape / Delete | Clear all     |
| Backspace       | Clear entry   |
| ( )             | Parentheses   |

---

## Screenshots

### Light Mode

[https://via.placeholder.com/600x400.png?text=Light+Mode+Screenshot](https://via.placeholder.com/600x400.png?text=Light+Mode+Screenshot)

### Dark Mode

[https://via.placeholder.com/600x400.png?text=Dark+Mode+Screenshot](https://via.placeholder.com/600x400.png?text=Dark+Mode+Screenshot)

### Mobile View

[https://via.placeholder.com/300x500.png?text=Mobile+View+Screenshot](https://via.placeholder.com/300x500.png?text=Mobile+View+Screenshot)

---

## Contributing

1. Fork the repository
2. Create a feature branch

   ```bash
   git checkout -b new-feature
   ```
3. Commit your changes

   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch

   ```bash
   git push origin new-feature
   ```
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License**.
See the `LICENSE` file for details.

---

## Author

Created with ❤️ by **[Your Name]**

---

## Notes

This application is ready to be deployed on **GitHub Pages**.
Simply upload the files to a GitHub repository and enable GitHub Pages in **Settings**.

---

## Usage Instructions

1. Copy each code section into its respective file
2. Place all files in the same folder
3. Open `index.html` in a browser
4. The application is ready to use and deploy

---

### Specification Checklist

* ✅ 4 separate files (HTML, CSS, JS, README)
* ✅ Expression evaluation with operator precedence
* ✅ History management with localStorage
* ✅ Responsive design
* ✅ Light/Dark mode
* ✅ Comprehensive error handling
* ✅ Keyboard input support
* ✅ Scientific and memory functions

The code runs without external dependencies except Font Awesome and Google Fonts via CDN.

```
