(function() {
  /**
   * Finds the element causing horizontal scroll on the page,
   * highlights it, and suggests CSS solutions.
   */
  function findAndSuggestHorizontalScrollerSolution() {
    let offendingElement = null;
    // Get the current viewport width to compare against element widths
    const viewportWidth = document.documentElement.clientWidth;

    // Iterate through all elements in the body
    Array.from(document.body.querySelectorAll('*')).forEach(element => {
      // Check if the element is visible, its offsetWidth exceeds the viewport,
      // and it's not primarily a vertically scrollable element.
      // The +5 tolerance is to account for minor rendering differences or borders.
      if (element.offsetWidth > viewportWidth &&
          element.style.display !== 'none' &&
          element.style.visibility !== 'hidden' &&
          element.scrollHeight <= element.clientHeight + 5) { // Exclude vertical scrollers
        // If this element is wider than the current widest found, mark it as the offender.
        // This helps in finding the "main" element causing the overflow.
        if (offendingElement === null || element.offsetWidth > offendingElement.offsetWidth) {
            offendingElement = element;
        }
      }
    });

    if (offendingElement) {
      console.log('Offending element causing horizontal scroll:', offendingElement);

      // Store original background color to restore it later
      const originalBackground = offendingElement.style.backgroundColor;

      let count = 0;
      // Make the offending element blink green to draw attention
      const interval = setInterval(() => {
        if (count < 6) { // Blink 3 times (on and off)
          offendingElement.style.backgroundColor = (count % 2 === 0) ? 'lime' : originalBackground;
          count++;
        } else {
          clearInterval(interval);
          offendingElement.style.backgroundColor = originalBackground; // Restore original background

          let solutionMessage = 'An element causing horizontal scroll has been highlighted in green. \n\n';
          solutionMessage += '**Offending Element:** \n';
          solutionMessage += offendingElement.tagName +
                             (offendingElement.id ? ' (ID: #' + offendingElement.id + ')' : '') +
                             (offendingElement.className ? ' (Classes: .' + offendingElement.className.split(' ').join('.') + ')' : '') + '\n\n';

          solutionMessage += '**Suggested CSS Solutions:**\n';

          // Suggest common solutions
          if (offendingElement.scrollWidth > offendingElement.clientWidth) {
              solutionMessage += '1.  **For the offending element or its parent:**\n';
              solutionMessage += '    `overflow-x: hidden;`\n';
              solutionMessage += '    This prevents horizontal scrollbars and hides overflowing content.\n\n';
              solutionMessage += '2.  **If content must be visible but unwanted scroll is present:**\n';
              solutionMessage += '    `max-width: 100%;`\n';
              solutionMessage += '    `box-sizing: border-box;`\n';
              solutionMessage += '    Apply this to the offending element or child elements/images causing overflow.\n\n';
              solutionMessage += '3.  **Check for `white-space: nowrap;` or excessively large `min-width` properties**\n';
              solutionMessage += '    These might be applied to the element or its children and need adjustment.\n\n';
              solutionMessage += '4.  **For large images or videos within the element:**\n';
              solutionMessage += '    `img, video { max-width: 100%; height: auto; }`\n';
              solutionMessage += '    Ensures media doesn\'t exceed its container.\n\n';
          } else {
              solutionMessage += 'This element appears wider than the viewport, but not necessarily due to its own scrollWidth.\n';
              solutionMessage += 'Possible causes include large margins/padding or child elements.\n';
              solutionMessage += '1.  **For the offending element or its parent:**\n';
              solutionMessage += '    `overflow-x: hidden;`\n';
              solutionMessage += '2.  **Inspect computed styles for large `margin` or `padding` values.**\n';
          }

          alert(solutionMessage);
        }
      }, 500); // Blinks every 0.5 seconds

    } else {
      alert('No element causing horizontal scroll was detected.');
    }
  }

  // Execute the main function when the script runs
  findAndSuggestHorizontalScrollerSolution();
})();
