using System;

namespace TypescriptGeneration
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct | AttributeTargets.Interface | AttributeTargets.Enum)]
    public class TypescriptAttribute : Attribute
    {
        public TypescriptAttribute()
        {
            GenerateClass = true;
        }
        public bool GenerateInterface { get; set; }
        public bool GenerateClass { get; set; }
        public bool GenerateTypeProperty { get; set; }
        public bool GenerateInterfaceMethods { get; set; }
    }
}