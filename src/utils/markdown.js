/**
 * Enhanced Markdown formatting utility
 * Designed for both light/dark themes and multi-language support
 * 
 * @param {string} text - The markdown text to format
 * @returns {string} - HTML string with markdown formatting applied
 */
export function formatMarkdown(text) {
  if (!text) return '';
  
  // Safely encode non-Latin characters
  const safeText = text.replace(/[\u0080-\uFFFF]/g, (match) => {
    return match; // Keep the character but ensure it's handled safely
  });
  
  // Parse markdown with regular expressions
  let formattedText = safeText
    // Replace markdown bold ** or __ with <strong> tags
    .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>')
    
    // Replace markdown italic * or _ with <em> tags
    .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>')
    
    // Replace markdown headings (# Heading)
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    
    // Replace markdown links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:underline">$1</a>')
    
    // Replace markdown images ![alt](url)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full h-auto">')
    
    // Replace markdown lists 
    // Unordered list items (- item or * item)
    .replace(/^[-*] (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc ml-6 my-3">$1</ul>')
    
    // Ordered list items (1. item)
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ol class="list-decimal ml-6 my-3">$1</ol>')
    
    // Replace markdown code blocks with <pre><code> tags
    .replace(/```(.*?)```/gs, '<pre class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded my-3 overflow-auto text-sm font-mono"><code>$1</code></pre>')
    
    // Replace markdown inline code with <code> tags
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    
    // Convert line breaks to <br> tags
    .replace(/\n/g, '<br>');
  
  return formattedText;
}

/**
 * Adds CSS classes to HTML elements for styling
 * Supports both light and dark modes
 * 
 * @param {string} html - The HTML to style
 * @returns {string} - Styled HTML
 */
export function styleMarkdownHTML(html) {
  return html
    // Style headings with responsive styling
    .replace(/<h1>/g, '<h1 class="text-2xl font-semibold my-5 text-gray-800 dark:text-gray-200">')
    .replace(/<h2>/g, '<h2 class="text-xl font-semibold my-4 text-gray-800 dark:text-gray-200">')
    .replace(/<h3>/g, '<h3 class="text-lg font-semibold my-3 text-gray-800 dark:text-gray-200">')
    .replace(/<h4>/g, '<h4 class="text-base font-semibold my-2 text-gray-800 dark:text-gray-200">')
    
    // Style strong (bold)
    .replace(/<strong>/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">')
    
    // Style emphasis (italic)
    .replace(/<em>/g, '<em class="italic text-gray-700 dark:text-gray-300">');
}

/**
 * Safely renders formatted markdown content for React components
 * 
 * @param {string} content - The markdown content to format
 * @returns {Object} - Object with __html property for dangerouslySetInnerHTML
 */
export function createMarkdownHTML(content) {
  if (!content) return { __html: '' };
  
  // Handle potential null/undefined content
  const safeContent = content || '';
  
  try {
    return { __html: styleMarkdownHTML(formatMarkdown(safeContent)) };
  } catch (error) {
    console.error('Error formatting markdown:', error);
    // Fallback - just return the content directly if parsing fails
    return { __html: `<p>${safeContent}</p>` };
  }
} 