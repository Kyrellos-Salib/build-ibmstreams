package com.ibm.streamsx.inet.rest.ops;

@com.ibm.streams.operator.internal.model.ShadowClass("com.ibm.streamsx.inet.rest.ops.Functions")
@javax.annotation.Generated("com.ibm.streams.operator.internal.model.processors.ShadowClassGenerator")
public class Functions$StreamsModel {

@com.ibm.streams.function.model.Function(namespace="com.ibm.streamsx.inet.rest", description="Obfuscate a password for an operator in this namespace.If the password is starts with `OBF:` then it is assumed to be already obfuscated and input is returned unchanged. This allowsexternal tools to pass submission time values that are already obfuscated. The Eclipse Jetty class `org.eclipse.jetty.util.security.Password` is the underlying utility.")
@com.ibm.streams.operator.internal.model.MethodParameters({"password"})
public static java.lang.String obfuscate(java.lang.String password) {return null; }
}