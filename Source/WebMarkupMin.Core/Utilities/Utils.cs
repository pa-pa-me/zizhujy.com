namespace WebMarkupMin.Core.Utilities
{
	using System;
	using System.Collections.Generic;
	using System.Reflection;
	using System.Text.RegularExpressions;

	using Resources;

	public static class Utils
	{
		/// <summary>
		/// Regular expression for working with whitespace
		/// </summary>
		private static readonly Regex _whitespaceRegex = new Regex(@"\s+");

		/// <summary>
		/// Regular expression for working with ending semicolons
		/// </summary>
		private static readonly Regex _endingSemicolonWithSpacesRegex = new Regex(@"\s*;\s*$");


		/// <summary>
		/// Creates instance by specified full type name
		/// </summary>
		/// <param name="fullTypeName">Full type name</param>
		/// <typeparam name="T">Target type</typeparam>
		/// <returns>Instance of type</returns>
		internal static T CreateInstanceByFullTypeName<T>(string fullTypeName) where T : class
		{
			if (string.IsNullOrWhiteSpace(fullTypeName))
			{
				throw new ArgumentNullException(Strings.Common_ValueIsEmpty);
			}

			string typeName;
			string assemblyName;
			Assembly assembly;
			int commaPosition = fullTypeName.IndexOf(',');

			if (commaPosition != -1)
			{
				typeName = fullTypeName.Substring(0, commaPosition).Trim();
				if (string.IsNullOrEmpty(typeName))
				{
					throw new EmptyValueException(Strings.Common_TypeNameIsEmpty);
				}

				assemblyName = fullTypeName.Substring(commaPosition + 1,
					fullTypeName.Length - (commaPosition + 1)).Trim();
				if (string.IsNullOrEmpty(assemblyName))
				{
					throw new EmptyValueException(Strings.Common_AssemblyNameIsEmpty);
				}

				assembly = Assembly.Load(assemblyName);
			}
			else
			{
				typeName = fullTypeName;
				assembly = typeof(Utils).Assembly;
				assemblyName = assembly.FullName;
			}

			object instance = assembly.CreateInstance(typeName);
			if (instance == null)
			{
				throw new NullReferenceException(string.Format(Strings.Common_InstanceCreationFailed,
					typeName, assemblyName));
			}

			return (T)instance;
		}

		/// <summary>
		/// Converts value of source enumeration type to value of destination enumeration type
		/// </summary>
		/// <typeparam name="TSource">Source enumeration type</typeparam>
		/// <typeparam name="TDest">Destination enumeration type</typeparam>
		/// <param name="value">Value of source enumeration type</param>
		/// <returns>Value of destination enumeration type</returns>
		public static TDest GetEnumFromOtherEnum<TSource, TDest>(TSource value)
		{
			string name = value.ToString();
			var destEnumValues = (TDest[])Enum.GetValues(typeof(TDest));

			foreach (var destEnum in destEnumValues)
			{
				if (string.Equals(destEnum.ToString(), name, StringComparison.OrdinalIgnoreCase))
				{
					return destEnum;
				}
			}

			throw new InvalidCastException(
				string.Format(Strings.Common_EnumValueConversionFailed,
					name, typeof(TSource), typeof(TDest))
			);
		}

		/// <summary>
		/// Collapses a whitespace
		/// </summary>
		/// <param name="value">String value</param>
		/// <returns>String value without extra spaces</returns>
		internal static string CollapseWhitespace(string value)
		{
			return _whitespaceRegex.Replace(value, " ");
		}

		/// <summary>
		/// Removes a ending semicolon
		/// </summary>
		/// <param name="value">String value</param>
		/// <returns>String value without ending semicolon</returns>
		internal static string RemoveEndingSemicolon(string value)
		{
			return _endingSemicolonWithSpacesRegex.Replace(value, string.Empty);
		}

		/// <summary>
		/// Determines whether the value contains a upper case letters
		/// </summary>
		/// <param name="value">String value</param>
		/// <returns>true if the value contains an upper case letters; otherwise, false</returns>
		internal static bool ContainsUppercaseCharacters(string value)
		{
			int characterCount = value.Length;

			for (int characterIndex = 0; characterIndex < characterCount; characterIndex++)
			{
				char character = value[characterIndex];
				if (char.IsLetter(character) && char.IsUpper(character))
				{
					return true;
				}
			}

			return false;
		}

		/// <summary>
		/// Produces a set union of many sequences
		/// </summary>
		/// <typeparam name="TSource">The type of the elements of the input sequences</typeparam>
		/// <param name="sequences">Input sequences</param>
		/// <returns>An System.Collections.Generic.HashSet&lt;T&gt; that contains the elements from
		/// input sequences, excluding duplicates</returns>
		internal static HashSet<TSource> UnionHashSets<TSource>(params IEnumerable<TSource>[] sequences)
		{
			var result = new HashSet<TSource>();
			int sequenceCount = sequences.Length;

			for (int sequenceIndex = 0; sequenceIndex < sequenceCount; sequenceIndex++)
			{
				result.UnionWith(sequences[sequenceIndex]);
			}

			return result;
		}
	}
}