namespace WebMarkupMin.Core.Configuration
{
	using System.Configuration;

	/// <summary>
	/// Common configuration settings of HTML minification
	/// </summary>
	public abstract class CommonHtmlMinificationConfigurationBase : ConfigurationElement
	{
		/// <summary>
		/// Gets or sets a whitespace minification mode
		/// </summary>
		[ConfigurationProperty("whitespaceMinificationMode", DefaultValue = WhitespaceMinificationMode.Medium)]
		public WhitespaceMinificationMode WhitespaceMinificationMode
		{
			get { return (WhitespaceMinificationMode)this["whitespaceMinificationMode"]; }
			set { this["whitespaceMinificationMode"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove all HTML comments
		/// except conditional, noindex, KnockoutJS containerless comments
		/// and AngularJS comment directives
		/// </summary>
		[ConfigurationProperty("removeHtmlComments", DefaultValue = true)]
		public bool RemoveHtmlComments
		{
			get { return (bool)this["removeHtmlComments"]; }
			set { this["removeHtmlComments"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove HTML comments from scripts and styles
		/// </summary>
		[ConfigurationProperty("removeHtmlCommentsFromScriptsAndStyles", DefaultValue = true)]
		public bool RemoveHtmlCommentsFromScriptsAndStyles
		{
			get { return (bool)this["removeHtmlCommentsFromScriptsAndStyles"]; }
			set { this["removeHtmlCommentsFromScriptsAndStyles"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to use short DOCTYPE
		/// </summary>
		public abstract bool UseShortDoctype
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to use META charset tag
		/// </summary>
		public abstract bool UseMetaCharsetTag
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove tags without content
		/// (except for <code>textarea</code>, <code>tr</code>, <code>th</code> and <code>td</code> tags,
		/// and tags with <code>class</code>, <code>id</code>, <code>name</code>, <code>role</code>,
		/// <code>src</code> and <code>data-*</code> attributes)
		/// </summary>
		[ConfigurationProperty("removeTagsWithoutContent", DefaultValue = false)]
		public bool RemoveTagsWithoutContent
		{
			get { return (bool)this["removeTagsWithoutContent"]; }
			set { this["removeTagsWithoutContent"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove attributes, that has empty value
		/// (valid attributes are: <code>class</code>, <code>id</code>, <code>name</code>,
		/// <code>style</code>, <code>title</code>, <code>lang</code>, <code>dir</code>, event attributes,
		/// <code>action</code> of <code>form</code> tag and <code>value</code> of <code>input</code> tag)
		/// </summary>
		[ConfigurationProperty("removeEmptyAttributes", DefaultValue = true)]
		public bool RemoveEmptyAttributes
		{
			get { return (bool)this["removeEmptyAttributes"]; }
			set { this["removeEmptyAttributes"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove redundant attributes
		/// </summary>
		[ConfigurationProperty("removeRedundantAttributes", DefaultValue = true)]
		public bool RemoveRedundantAttributes
		{
			get { return (bool)this["removeRedundantAttributes"]; }
			set { this["removeRedundantAttributes"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove the HTTP protocol portion
		/// (<code>http:</code>) from URI-based attributes
		/// </summary>
		[ConfigurationProperty("removeHttpProtocolFromAttributes", DefaultValue = false)]
		public bool RemoveHttpProtocolFromAttributes
		{
			get { return (bool)this["removeHttpProtocolFromAttributes"]; }
			set { this["removeHttpProtocolFromAttributes"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove the HTTPS protocol portion
		/// (<code>https:</code>) from URI-based attributes
		/// </summary>
		[ConfigurationProperty("removeHttpsProtocolFromAttributes", DefaultValue = false)]
		public bool RemoveHttpsProtocolFromAttributes
		{
			get { return (bool)this["removeHttpsProtocolFromAttributes"]; }
			set { this["removeHttpsProtocolFromAttributes"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove the <code>javascript:</code>
		/// pseudo-protocol portion from event attributes
		/// </summary>
		[ConfigurationProperty("removeJsProtocolFromAttributes", DefaultValue = true)]
		public bool RemoveJsProtocolFromAttributes
		{
			get { return (bool)this["removeJsProtocolFromAttributes"]; }
			set { this["removeJsProtocolFromAttributes"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to minify CSS code in <code>style</code> tags
		/// </summary>
		[ConfigurationProperty("minifyEmbeddedCssCode", DefaultValue = true)]
		public bool MinifyEmbeddedCssCode
		{
			get { return (bool)this["minifyEmbeddedCssCode"]; }
			set { this["minifyEmbeddedCssCode"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to minify CSS code in <code>style</code> attributes
		/// </summary>
		[ConfigurationProperty("minifyInlineCssCode", DefaultValue = true)]
		public bool MinifyInlineCssCode
		{
			get { return (bool)this["minifyInlineCssCode"]; }
			set { this["minifyInlineCssCode"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to minify JavaScript code in <code>script</code> tags
		/// </summary>
		[ConfigurationProperty("minifyEmbeddedJsCode", DefaultValue = true)]
		public bool MinifyEmbeddedJsCode
		{
			get { return (bool)this["minifyEmbeddedJsCode"]; }
			set { this["minifyEmbeddedJsCode"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to minify JS code in event attributes
		/// and hyperlinks with <code>javascript:</code> pseudo-protocol
		/// </summary>
		[ConfigurationProperty("minifyInlineJsCode", DefaultValue = true)]
		public bool MinifyInlineJsCode
		{
			get { return (bool)this["minifyInlineJsCode"]; }
			set { this["minifyInlineJsCode"] = value; }
		}

		/// <summary>
		/// Gets or sets a comma-separated list of types of <code>script</code> tags, that are processed by minifier
		/// (e.g. <code>"text/html, text/ng-template"</code>)
		/// </summary>
		[ConfigurationProperty("processableScriptTypeList", DefaultValue = "")]
		public string ProcessableScriptTypeList
		{
			get { return (string)this["processableScriptTypeList"]; }
			set { this["processableScriptTypeList"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to minify the KnockoutJS binding expressions
		//  in <code>data-bind</code> attributes and containerless comments
		/// </summary>
		[ConfigurationProperty("minifyKnockoutBindingExpressions", DefaultValue = false)]
		public bool MinifyKnockoutBindingExpressions
		{
			get { return (bool) this["minifyKnockoutBindingExpressions"]; }
			set { this["minifyKnockoutBindingExpressions"] = value; }
		}

		/// <summary>
		/// Gets or sets a flag for whether to minify the AngularJS binding expressions
		//  in Mustache-style tags (<code>{{}}</code>) and directives
		/// </summary>
		[ConfigurationProperty("minifyAngularBindingExpressions", DefaultValue = false)]
		public bool MinifyAngularBindingExpressions
		{
			get { return (bool)this["minifyAngularBindingExpressions"]; }
			set { this["minifyAngularBindingExpressions"] = value; }
		}

		/// <summary>
		/// Gets or sets a comma-separated list of names of custom AngularJS
		/// directives (e.g. <code>"myDir, btfCarousel"</code>), that contain expressions
		/// </summary>
		[ConfigurationProperty("customAngularDirectiveList", DefaultValue = "")]
		public string CustomAngularDirectiveList
		{
			get { return (string)this["customAngularDirectiveList"]; }
			set { this["customAngularDirectiveList"] = value; }
		}
	}
}