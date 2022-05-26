﻿namespace WebMarkupMin.Core.Settings
{
	using System.Collections.Generic;
	using System.Text;

	/// <summary>
	/// Common HTML minification settings
	/// </summary>
	public abstract class CommonHtmlMinificationSettingsBase
	{
		/// <summary>
		/// Gets or sets a whitespace minification mode
		/// </summary>
		public WhitespaceMinificationMode WhitespaceMinificationMode
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove all HTML comments
		/// except conditional, noindex, KnockoutJS containerless comments
		/// and AngularJS comment directives
		/// </summary>
		public bool RemoveHtmlComments
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove HTML comments from scripts and styles
		/// </summary>
		public bool RemoveHtmlCommentsFromScriptsAndStyles
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to use short DOCTYPE
		/// </summary>
		public bool UseShortDoctype
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to use META charset tag
		/// </summary>
		public bool UseMetaCharsetTag
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
		public bool RemoveTagsWithoutContent
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove attributes, that has empty value
		/// (valid attributes are: <code>class</code>, <code>id</code>, <code>name</code>,
		/// <code>style</code>, <code>title</code>, <code>lang</code>, <code>dir</code>, event attributes,
		/// <code>action</code> of <code>form</code> tag and <code>value</code> of <code>input</code> tag)
		/// </summary>
		public bool RemoveEmptyAttributes
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove redundant attributes
		/// </summary>
		public bool RemoveRedundantAttributes
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove the HTTP protocol portion
		/// (<code>http:</code>) from URI-based attributes
		/// </summary>
		public bool RemoveHttpProtocolFromAttributes
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove the HTTPS protocol portion
		/// (<code>https:</code>) from URI-based attributes
		/// </summary>
		public bool RemoveHttpsProtocolFromAttributes
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to remove the <code>javascript:</code>
		/// pseudo-protocol portion from event attributes
		/// </summary>
		public bool RemoveJsProtocolFromAttributes
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to minify CSS code in <code>style</code> tags
		/// </summary>
		public bool MinifyEmbeddedCssCode
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to minify CSS code in <code>style</code> attributes
		/// </summary>
		public bool MinifyInlineCssCode
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to minify JavaScript code in <code>script</code> tags
		/// </summary>
		public bool MinifyEmbeddedJsCode
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to minify JS code in event attributes
		/// and hyperlinks with <code>javascript:</code> pseudo-protocol
		/// </summary>
		public bool MinifyInlineJsCode
		{
			get;
			set;
		}

		#region Processable script types
		/// <summary>
		/// Collection of types of <code>script</code> tags, that are processed by minifier
		/// </summary>
		private readonly HashSet<string> _processableScriptTypes;

		/// <summary>
		/// Gets a collection of types of <code>script</code> tags, that are processed by minifier
		/// </summary>
		public IEnumerable<string> ProcessableScriptTypeCollection
		{
			get
			{
				return _processableScriptTypes;
			}
		}

		/// <summary>
		/// Sets a processable script types
		/// </summary>
		/// <param name="scriptTypes">Collection of processable script types</param>
		public int SetProcessableScriptTypes(IEnumerable<string> scriptTypes)
		{
			_processableScriptTypes.Clear();

			if (scriptTypes != null)
			{
				foreach (string scriptType in scriptTypes)
				{
					AddProcessableScriptType(scriptType);
				}
			}

			return _processableScriptTypes.Count;
		}

		/// <summary>
		/// Adds a processable script type to the list
		/// </summary>
		/// <param name="scriptType">Processable script type</param>
		/// <returns>true - valid script type; false - invalid script type</returns>
		public bool AddProcessableScriptType(string scriptType)
		{
			if (!string.IsNullOrWhiteSpace(scriptType))
			{
				string processedScriptType = scriptType.Trim().ToLowerInvariant();
				_processableScriptTypes.Add(processedScriptType);

				return true;
			}

			return false;
		}

		/// <summary>
		/// Gets or sets a comma-separated list of types of <code>script</code> tags, that are processed by minifier
		/// (e.g. <code>"text/html, text/ng-template"</code>)
		/// </summary>
		public string ProcessableScriptTypeList
		{
			get
			{
				var sb = new StringBuilder();

				foreach (string scriptType in _processableScriptTypes)
				{
					if (sb.Length > 0)
					{
						sb.Append(",");
					}
					sb.Append(scriptType);
				}

				return sb.ToString();
			}
			set
			{
				_processableScriptTypes.Clear();

				if (!string.IsNullOrWhiteSpace(value))
				{
					string[] scriptTypes = value.Split(',');

					foreach (string scriptType in scriptTypes)
					{
						AddProcessableScriptType(scriptType);
					}
				}
			}
		}
		#endregion

		/// <summary>
		/// Gets or sets a flag for whether to minify the KnockoutJS binding expressions
		//  in <code>data-bind</code> attributes and containerless comments
		/// </summary>
		public bool MinifyKnockoutBindingExpressions
		{
			get;
			set;
		}

		/// <summary>
		/// Gets or sets a flag for whether to minify the AngularJS binding expressions
		//  in Mustache-style tags (<code>{{}}</code>) and directives
		/// </summary>
		public bool MinifyAngularBindingExpressions
		{
			get;
			set;
		}

		#region Custom Angular directives with expressions
		/// <summary>
		/// Collection of names of custom AngularJS directives, that contain expressions
		/// </summary>
		private readonly HashSet<string> _customAngularDirectives;

		/// <summary>
		/// Gets a collection of names of custom AngularJS directives, that contain expressions
		/// </summary>
		public IEnumerable<string> CustomAngularDirectiveCollection
		{
			get
			{
				return _customAngularDirectives;
			}
		}

		/// <summary>
		/// Sets a names of custom AngularJS directives
		/// </summary>
		/// <param name="directiveNames">Collection of names of custom AngularJS directives</param>
		public int SetCustomAngularDirectives(IEnumerable<string> directiveNames)
		{
			_customAngularDirectives.Clear();

			if (directiveNames != null)
			{
				foreach (string directiveName in directiveNames)
				{
					AddCustomAngularDirective(directiveName);
				}
			}

			return _customAngularDirectives.Count;
		}

		/// <summary>
		/// Adds a name of custom AngularJS directive to the list
		/// </summary>
		/// <param name="directiveName">Name of custom AngularJS directive</param>
		/// <returns>true - valid directive name; false - invalid directive name</returns>
		public bool AddCustomAngularDirective(string directiveName)
		{
			if (!string.IsNullOrWhiteSpace(directiveName))
			{
				string processedDirectiveName = directiveName.Trim();
				_customAngularDirectives.Add(processedDirectiveName);

				return true;
			}

			return false;
		}

		/// <summary>
		/// Gets or sets a comma-separated list of names of custom AngularJS
		/// directives (e.g. <code>"myDir, btfCarousel"</code>), that contain expressions
		/// </summary>
		public string CustomAngularDirectiveList
		{
			get
			{
				var sb = new StringBuilder();

				foreach (string directiveName in _customAngularDirectives)
				{
					if (sb.Length > 0)
					{
						sb.Append(",");
					}
					sb.Append(directiveName);
				}

				return sb.ToString();
			}
			set
			{
				_customAngularDirectives.Clear();

				if (!string.IsNullOrWhiteSpace(value))
				{
					string[] directiveNames = value.Split(',');

					foreach (string directiveName in directiveNames)
					{
						AddCustomAngularDirective(directiveName);
					}
				}
			}
		}
		#endregion


		/// <summary>
		/// Constructs instance of common HTML minification settings
		/// </summary>
		/// <param name="useEmptyMinificationSettings">Initiates the creation of
		/// empty common HTML minification settings</param>
		protected CommonHtmlMinificationSettingsBase(bool useEmptyMinificationSettings)
		{
			if (!useEmptyMinificationSettings)
			{
				WhitespaceMinificationMode = WhitespaceMinificationMode.Medium;
				RemoveHtmlComments = true;
				RemoveHtmlCommentsFromScriptsAndStyles = true;
				RemoveEmptyAttributes = true;
				RemoveRedundantAttributes = true;
				RemoveJsProtocolFromAttributes = true;
				MinifyEmbeddedCssCode = true;
				MinifyInlineCssCode = true;
				MinifyEmbeddedJsCode = true;
				MinifyInlineJsCode = true;
			}
			else
			{
				WhitespaceMinificationMode = WhitespaceMinificationMode.None;
				RemoveHtmlComments = false;
				RemoveHtmlCommentsFromScriptsAndStyles = false;
				RemoveEmptyAttributes = false;
				RemoveRedundantAttributes = false;
				RemoveJsProtocolFromAttributes = false;
				MinifyEmbeddedCssCode = false;
				MinifyInlineCssCode = false;
				MinifyEmbeddedJsCode = false;
				MinifyInlineJsCode = false;
			}
			RemoveTagsWithoutContent = false;
			RemoveHttpProtocolFromAttributes = false;
			RemoveHttpsProtocolFromAttributes = false;

			// No default processable script types
			_processableScriptTypes = new HashSet<string>();

			MinifyKnockoutBindingExpressions = false;
			MinifyAngularBindingExpressions = false;

			// No default custom Angular directives with expressions
			_customAngularDirectives = new HashSet<string>();
		}
	}
}