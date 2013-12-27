(function (aloha) {

	'use strict';

	var WordTransform = aloha.WordTransform;

	module('MS Word Parser - Table of Contents');

	test('table of contents with title heading', function () {
		var htmlRes = WordTransform.transform(
			'<p style="margin: 24pt 0in 0pt;" class="MsoTocHeading"><strong><font size="5"><font color="#2e74b5"><font face="Calibri Light"><span style="mso-ansi-language: DE;" lang="DE">Inhalt</span><?xml:namespace prefix = o ns = "urn:schemas-microsoft-com:office:office" /><o:p></o:p><span style="mso-ansi-language: DE;" lang="DE"><?xml:namespace prefix = w ns = "urn:schemas-microsoft-com:office:word" /><w:sdtpr></w:sdtpr></span></font></font></font></strong></p>' +
				'<p style="margin: 0in 0in 5pt; tab-stops: right dotted 467.5pt;" class="MsoToc1"><span class="MsoHyperlink"><span style="mso-no-proof: yes;"><a href="http://10.43.87.156:3001/sandbox.text.swp/simpleText.html#_Toc374336804"><font face="Calibri"><span style="mso-ansi-language: ES;" lang="ES"><font color="#0563c1">url</font></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"><span style="mso-tab-count: 1 dotted;"> </span></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;">1</span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"></span></font></a></span></span><span style="mso-no-proof: yes;"><o:p></o:p></span></p>' +
				'<p style="margin: 0in 0in 5pt; tab-stops: right dotted 467.5pt;" class="MsoToc1"><span class="MsoHyperlink"><span style="mso-no-proof: yes;"><a href="http://10.43.87.156:3001/sandbox.text.swp/simpleText.html#_Toc374336805"><font face="Calibri"><span style="mso-ansi-language: ES;" lang="ES"><font color="#0563c1">Heading1</font></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"><span style="mso-tab-count: 1 dotted;">. </span></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;">1</span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"></span></font></a></span></span><span style="mso-no-proof: yes;"><o:p></o:p></span></p>' +
				'<p style="margin: 0in 0in 5pt 11pt; tab-stops: right dotted 467.5pt;" class="MsoToc2"><span class="MsoHyperlink"><span style="mso-no-proof: yes;"><a href="http://10.43.87.156:3001/sandbox.text.swp/simpleText.html#_Toc374336806"><font face="Calibri"><span style="mso-ansi-language: ES;" lang="ES"><font color="#0563c1">Heading2</font></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"><span style="mso-tab-count: 1 dotted;">. </span></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;">1</span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"></span></font></a></span></span><span style="mso-no-proof: yes;"><o:p></o:p></span></p>' +
				'<p style="margin: 0in 0in 5pt 22pt; tab-stops: right dotted 467.5pt;" class="MsoToc3"><span class="MsoHyperlink"><span style="mso-no-proof: yes;"><a href="http://10.43.87.156:3001/sandbox.text.swp/simpleText.html#_Toc374336807"><font face="Calibri"><span style="mso-ansi-language: ES;" lang="ES"><font color="#0563c1">Heading3</font></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"><span style="mso-tab-count: 1 dotted;">. </span></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;">1</span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"></span></font></a></span></span><span style="mso-no-proof: yes;"><o:p></o:p></span></p>' +
				'<p style="margin: 0in 0in 8pt;" class="MsoNormal"><b><span style="mso-ansi-language: DE;" lang="DE"><o:p><font face="Calibri">&nbsp;</font></o:p></span></b></p>' +
				'<h1><span lang=ES style=\'mso-ansi-language:ES\'><a href="http://www.marca.com"><span style=\'mso-bookmark:_Toc374416888\'>url</span><span style=\'mso-bookmark:_Toc374416888\'></span></a><![if !supportNestedAnchors]><a' +
				' name="_Toc374416888"></a><![endif]><o:p></o:p></span></h1>' +
				'<h1><a name="_Toc374416889"><span lang=ES style=\'mso-ansi-language:ES\'>Heading1</span></a><span' +
				' lang=ES style=\'mso-ansi-language:ES\'><o:p></o:p></span></h1>' +
				'<h2><a name="_Toc374416890"><span lang=ES style=\'mso-ansi-language:ES\'>Heading2</span></a><span' +
				' lang=ES style=\'mso-ansi-language:ES\'><o:p></o:p></span></h2>' +
				'<h3><a name="_Toc374416891"><span lang=ES style=\'mso-ansi-language:ES\'>Heading3</span></a><span' +
				' lang=ES style=\'mso-ansi-language:ES\'><o:p></o:p></span></h3>');

		equal(htmlRes,
			'<h1>Inhalt</h1>' +
				'<ul style="list-style: none;">' +
				'<li>url</li>' +
				'<li>Heading1</li>' +
				'<ul style="list-style: none;">' +
				'<li>Heading2</li>' +
				'<ul style="list-style: none;">' +
				'<li>Heading3</li>' +
				'</ul>' +
				'</ul>' +
				'</ul><p><br></p>' +
				'<h1><a href="http://www.marca.com">url</a></h1><h1>Heading1</h1><h2>Heading2</h2><h3>Heading3</h3>');
	});

	test('table of contents without title heading', function () {
		var htmlRes = WordTransform.transform(
			'<p style="margin: 0in 0in 5pt; tab-stops: right dotted 467.5pt;" class="MsoToc1"><span class="MsoHyperlink"><span style="mso-no-proof: yes;"><a href="http://10.43.87.156:3001/sandbox.text.swp/simpleText.html#_Toc374336804"><font face="Calibri"><span style="mso-ansi-language: ES;" lang="ES"><font color="#0563c1">url</font></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"><span style="mso-tab-count: 1 dotted;"> </span></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;">1</span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"></span></font></a></span></span><span style="mso-no-proof: yes;"><o:p></o:p></span></p>' +
				'<p style="margin: 0in 0in 5pt; tab-stops: right dotted 467.5pt;" class="MsoToc1"><span class="MsoHyperlink"><span style="mso-no-proof: yes;"><a href="http://10.43.87.156:3001/sandbox.text.swp/simpleText.html#_Toc374336805"><font face="Calibri"><span style="mso-ansi-language: ES;" lang="ES"><font color="#0563c1">Heading1</font></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"><span style="mso-tab-count: 1 dotted;">. </span></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;">1</span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"></span></font></a></span></span><span style="mso-no-proof: yes;"><o:p></o:p></span></p>' +
				'<p style="margin: 0in 0in 5pt 11pt; tab-stops: right dotted 467.5pt;" class="MsoToc2"><span class="MsoHyperlink"><span style="mso-no-proof: yes;"><a href="http://10.43.87.156:3001/sandbox.text.swp/simpleText.html#_Toc374336806"><font face="Calibri"><span style="mso-ansi-language: ES;" lang="ES"><font color="#0563c1">Heading2</font></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"><span style="mso-tab-count: 1 dotted;">. </span></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;">1</span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"></span></font></a></span></span><span style="mso-no-proof: yes;"><o:p></o:p></span></p>' +
				'<p style="margin: 0in 0in 5pt 22pt; tab-stops: right dotted 467.5pt;" class="MsoToc3"><span class="MsoHyperlink"><span style="mso-no-proof: yes;"><a href="http://10.43.87.156:3001/sandbox.text.swp/simpleText.html#_Toc374336807"><font face="Calibri"><span style="mso-ansi-language: ES;" lang="ES"><font color="#0563c1">Heading3</font></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"><span style="mso-tab-count: 1 dotted;">. </span></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;">1</span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"></span></font></a></span></span><span style="mso-no-proof: yes;"><o:p></o:p></span></p>' +
				'<p style="margin: 0in 0in 8pt;" class="MsoNormal"><b><span style="mso-ansi-language: DE;" lang="DE"><o:p><font face="Calibri">&nbsp;</font></o:p></span></b></p>' +
				'<h1><span lang=ES style=\'mso-ansi-language:ES\'><a href="http://www.marca.com"><span style=\'mso-bookmark:_Toc374416888\'>url</span><span style=\'mso-bookmark:_Toc374416888\'></span></a><![if !supportNestedAnchors]><a' +
				' name="_Toc374416888"></a><![endif]><o:p></o:p></span></h1>' +
				'<h1><a name="_Toc374416889"><span lang=ES style=\'mso-ansi-language:ES\'>Heading1</span></a><span' +
				' lang=ES style=\'mso-ansi-language:ES\'><o:p></o:p></span></h1>' +
				'<h2><a name="_Toc374416890"><span lang=ES style=\'mso-ansi-language:ES\'>Heading2</span></a><span' +
				' lang=ES style=\'mso-ansi-language:ES\'><o:p></o:p></span></h2>' +
				'<h3><a name="_Toc374416891"><span lang=ES style=\'mso-ansi-language:ES\'>Heading3</span></a><span' +
				' lang=ES style=\'mso-ansi-language:ES\'><o:p></o:p></span></h3>');

		equal(htmlRes,
			'<ul style="list-style: none;">' +
				'<li>url</li>' +
				'<li>Heading1</li>' +
				'<ul style="list-style: none;">' +
				'<li>Heading2</li>' +
				'<ul style="list-style: none;">' +
				'<li>Heading3</li>' +
				'</ul>' +
				'</ul>' +
				'</ul><p><br></p>' +
				'<h1><a href="http://www.marca.com">url</a></h1><h1>Heading1</h1><h2>Heading2</h2><h3>Heading3</h3>');
	});


	test('table of contents without title heading and diferent level', function () {
		var htmlRes = WordTransform.transform(
				'<p style="margin: 0in 0in 5pt 22pt; tab-stops: right dotted 467.5pt;" class="MsoToc3"><span class="MsoHyperlink"><span style="mso-no-proof: yes;"><a href="http://10.43.87.156:3001/sandbox.text.swp/simpleText.html#_Toc374336807"><font face="Calibri"><span style="mso-ansi-language: ES;" lang="ES"><font color="#0563c1">Heading 3</font></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"><span style="mso-tab-count: 1 dotted;">. </span></span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;">1</span><span style="color: windowtext; text-decoration: none; display: none; text-underline: none; mso-hide: screen;"></span></font></a></span></span><span style="mso-no-proof: yes;"><o:p></o:p></span></p>' +
				'<p style="margin: 0in 0in 8pt;" class="MsoNormal"><b><span style="mso-ansi-language: DE;" lang="DE"><o:p><font face="Calibri">&nbsp;</font></o:p></span></b></p>' +
				'<h1><span lang=ES style=\'mso-ansi-language:ES\'><a href="http://www.marca.com"><span style=\'mso-bookmark:_Toc374416888\'>url</span><span style=\'mso-bookmark:_Toc374416888\'></span></a><![if !supportNestedAnchors]><a' +
				' name="_Toc374416888"></a><![endif]><o:p></o:p></span></h1>' +
				'<h1><a name="_Toc374416889"><span lang=ES style=\'mso-ansi-language:ES\'>Heading1</span></a><span' +
				' lang=ES style=\'mso-ansi-language:ES\'><o:p></o:p></span></h1>' +
				'<h2><a name="_Toc374416890"><span lang=ES style=\'mso-ansi-language:ES\'>Heading2</span></a><span' +
				' lang=ES style=\'mso-ansi-language:ES\'><o:p></o:p></span></h2>' +
				'<h3><a name="_Toc374416891"><span lang=ES style=\'mso-ansi-language:ES\'>Heading3</span></a><span' +
				' lang=ES style=\'mso-ansi-language:ES\'><o:p></o:p></span></h3>');

		equal(htmlRes,
			'<ul style="list-style: none;">' +
				'<ul style="list-style: none;">' +
				'<ul style="list-style: none;">' +
				'<li>Heading 3</li>' +
				'</ul>' +
				'</ul>' +
				'</ul><p><br></p>' +
				'<h1><a href="http://www.marca.com">url</a></h1><h1>Heading1</h1><h2>Heading2</h2><h3>Heading3</h3>');
	});


})(window.aloha);