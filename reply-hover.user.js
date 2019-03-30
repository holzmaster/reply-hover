// ==UserScript==
// @name		Antwort-Kommentar via Hover
// @author		holzmaster
// @namespace	holzmaster
// @include		http://pr0gramm.com/*
// @include		https://pr0gramm.com/*
// @version		1.1.0
// @description	Zeigt und verlinkt den Post, auf den geantwortet wurde.
// @copyright	2016+, holzmaster
// @updateURL	https://holzmaster.github.io/reply-hover/reply-hover.user.js
// @downloadURL	https://holzmaster.github.io/reply-hover/reply-hover.user.js
// @icon		http://pr0gramm.com/media/pr0gramm-favicon.png
// @grant		none
// ==/UserScript==

(function() {
	const s = document.createElement('script');
	s.appendChild(document.createTextNode('(' + uneval(main) + ')();'));
	(document.body || document.head || document.documentElement).appendChild(s);

	function main() {
		"use strict";
		function addGlobalStyle(css) {
			const style = document.createElement("style");
			style.type = "text/css";
			style.innerHTML = css;
			document.head.appendChild(style);
		}

		const cssRule = ".reply-action-icon { transform: rotate(90deg); display: inline-block; } .post-preview { display: none; z-index: 10; background-color: #161618; padding: 10px; border: 1px solid #252525; color: #f2f5f4; font-size: 14px; box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.85); } .post-preview .preview-user { margin: 0 0 0 2px; color: #F5F7F6; } .reply-hover:hover + .post-preview { display: block; position: absolute; bottom: 2em; left: 0; } .reply-hover { color: var(--theme-main-color); }";

		const prefixHover = '<?js if (c.children.length > 0) {?> <span class="fold fold-in action"';

		const preview =  '<div id="post-preview-{c.id}" class="post-preview"> <div class="comment-content"> {commentParent.content.format()} </div> <div class="comment-foot"> <?js if(commentParent.name == itemUser){?> <span class="user-comment-op">OP</span> <?js } ?> <span class="preview-user um{commentParent.mark}">{commentParent.name}</span> <span class="score">{"Punkt".inflect(commentParent.score)}</span> <span class="time">{commentParent.date.relativeTime(true)}</span> </div></div>';
		const hoverElement = '<a href="#{tab}/{itemId}:comment{commentParent.id}" id="reply{c.id}" class="reply-hover pict reply-action-icon">r</a>';

		const previewElement =
			'<?js if(commentParent){ ?>' +
			hoverElement +
			preview +
			'<?js } ?>' +
			prefixHover;

		const recurseDefinitionOriginal = '<?js var recurseComments = function( comments, level ) {';
		const recurseDefinitionWithParent = '<?js var recurseComments = function( comments, level, commentParent ) {';

		const prefixRecurse = '<?js if( c.children.length ) { recurseComments(c.children, level+1); } ?>';
		const prefixRecurseFix = '<?js if( c.children.length ) { recurseComments(c.children, level+1, c); } ?>';

		p.View.Stream.Comments.prototype.template =
		p.View.Stream.Comments.prototype.template
			.replace(recurseDefinitionOriginal, recurseDefinitionWithParent) /* add a parent comment parameter to recurse function */
			.replace(prefixRecurse, prefixRecurseFix) /* Fix the recursive function call to include the parent parameter */
			.replace(prefixHover, previewElement); /* Add the hover element + preview */

		addGlobalStyle(cssRule);
	}
})();
