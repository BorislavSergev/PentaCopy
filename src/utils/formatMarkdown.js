/**
 * Simple Markdown formatting utility
 * Supports bold, italic, lists, and headings without external dependencies
 * 
 * @param {string} text - The markdown text to format
 * @returns {string} - HTML string with markdown formatting applied
 */
export function formatMarkdown(text) {
  if (!text) return '';
  
  // Parse markdown with regular expressions
  let formattedText = text
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
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>')
    
    // Replace markdown lists 
    // Unordered list items (- item or * item)
    .replace(/^[-*] (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc ml-4 my-2">$1</ul>')
    
    // Ordered list items (1. item)
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ol class="list-decimal ml-4 my-2">$1</ol>')
    
    // Replace markdown code blocks with <pre><code> tags
    .replace(/```(.*?)```/gs, '<pre class="bg-gray-100 dark:bg-gray-800 p-2 rounded my-2 overflow-auto"><code>$1</code></pre>')
    
    // Replace markdown inline code with <code> tags
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>')
    
    // Convert line breaks to <br> tags
    .replace(/\n/g, '<br>');
  
  return formattedText;
}

/**
 * Adds simple CSS classes to HTML elements for styling
 * 
 * @param {string} html - The HTML to style
 * @returns {string} - Styled HTML
 */
export function styleMarkdownHTML(html) {
  return html
    // Style headings
    .replace(/<h1>/g, '<h1 class="text-2xl font-bold my-4">')
    .replace(/<h2>/g, '<h2 class="text-xl font-bold my-3">')
    .replace(/<h3>/g, '<h3 class="text-lg font-bold my-2">')
    .replace(/<h4>/g, '<h4 class="text-base font-bold my-1">')
    
    // Style strong (bold)
    .replace(/<strong>/g, '<strong class="font-bold">')
    
    // Style emphasis (italic)
    .replace(/<em>/g, '<em class="italic">');
}

/**
 * Safely renders formatted markdown content
 * 
 * @param {string} content - The markdown content to format
 * @returns {Object} - Object with __html property for dangerouslySetInnerHTML
 */
export function createMarkdownHTML(content) {
  if (!content) return { __html: '' };
  return { __html: styleMarkdownHTML(formatMarkdown(content)) };
} 