using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Newtonsoft.Json.Linq;

namespace TypescriptGeneration
{
    class TypescriptConvert
    {
        private static ConcurrentDictionary<Type, string> _dictionary;

        static TypescriptConvert()
        {
            _dictionary = new ConcurrentDictionary<Type, string>();
            _dictionary.TryAdd(typeof (JToken), Any);
            _dictionary.TryAdd(typeof (bool), Boolean);
            _dictionary.TryAdd(typeof(void), Void);
            new[]
            {
                typeof (short), typeof (int), typeof (long), typeof (byte), typeof (double), typeof (sbyte),
                typeof (float), typeof (ushort), typeof (uint), typeof (ulong), typeof(decimal)
            }.ToList().ForEach(x => _dictionary.TryAdd(x, Number));
            new[] { typeof(DateTime), typeof(DateTimeOffset) }.ToList().ForEach(x => _dictionary.TryAdd(x, Date));
            new[] { typeof(string), typeof(Guid), typeof(TimeSpan), typeof(byte[]) }.ToList().ForEach(x => _dictionary.TryAdd(x, String));
        }

        public const string Boolean = "boolean";
        public const string String = "string";
        public const string Number = "number";
        public const string Any = "any";
        public const string Date = "Date";
        public const string Void = "void";
        public static string ToScriptType(Type typeReference)
        {
            var actualType = Nullable.GetUnderlyingType(typeReference) ?? typeReference;

            string typescriptType;

            if (_dictionary.TryGetValue(actualType, out typescriptType))
            {
                return typescriptType;
            }
            else
            {
                var dictionary = actualType.IsGenericType && actualType.GetGenericTypeDefinition() == typeof(IDictionary<,>) ? actualType : actualType.GetInterfaces().FirstOrDefault(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IDictionary<,>));
                var enumerable = actualType.IsGenericType && actualType.GetGenericTypeDefinition() == typeof(IEnumerable<>) ? actualType : actualType.GetInterfaces().FirstOrDefault(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IEnumerable<>));
                var typescriptAttributes = typeReference.GetCustomAttributes<TypescriptAttribute>().FirstOrDefault();
                if (dictionary != null)
                {
                    var type = dictionary.GetGenericArguments()[1];
                    return String.Format("TypescriptBuilder.IDictionaryString<{0}>", ToScriptType(type));
                }
                else if (enumerable != null)
                {
                    var type = enumerable.GetGenericArguments()[0];
                    return String.Format("Array<{0}>", ToScriptType(type));
                }
                else if (typescriptAttributes != null && (typescriptAttributes.GenerateClass || actualType.IsEnum))
                {
                    typescriptType = actualType.FullName;
                }
                else if (typescriptAttributes != null && typescriptAttributes.GenerateInterface)
                {
                    typescriptType = String.Format("{0}.I{1}", actualType.Namespace, actualType.Name);
                }
                else
                {
                    typescriptType = "any";
                }
                _dictionary.TryAdd(actualType, typescriptType);
                return typescriptType;
            }
        }
    }
}