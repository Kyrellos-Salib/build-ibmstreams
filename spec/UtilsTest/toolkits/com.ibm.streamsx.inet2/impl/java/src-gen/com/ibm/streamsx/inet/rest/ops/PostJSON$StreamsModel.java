package com.ibm.streamsx.inet.rest.ops;
import com.ibm.streams.operator.metrics.Metric.Kind;
import com.ibm.streams.operator.model.InputPortSet.WindowMode;
import com.ibm.streams.operator.model.InputPortSet.WindowPunctuationInputMode;
import com.ibm.streams.operator.model.OutputPortSet.WindowPunctuationOutputMode;

@com.ibm.streams.operator.model.SharedLoader()
@com.ibm.streams.operator.model.PrimitiveOperator(namespace="com.ibm.streamsx.inet.rest", name="HTTPJSONInjection", description="Embeds a Jetty web server to allow HTTP or HTTPS POST requests with mime type `application/json` to submit a tuple on its output ports. Each output port corresponds to a unique URL comprising the operator name and the port index.\n\nA single tuple is generated for an incoming POST request. The incoming JSON value is assigned to the `rstring jsonString` attribute if it exists,otherwise to the first attribute, which must be of SPL type `rstring` in the output port's schema corresponds to the contents of the POST requiring content-type `application/json`. Any other attributes will be set to their default value.\n\nThe URLs defined by this operator are:\n* *prefix*`/ports/output/`*port index*`/inject` - Accepts POST requests of type `application/xml`.\n* *prefix*`/ports/output/`*port index*`/info` - Output port meta-data including the stream attribute names and types (content type `application/json`).\n\nThe *prefix* for the URLs is:\n* *context path*`/`*base operator name* - When the `context` parameter is set.\n* *full operator name* - When the `context` parameter is **not** set.\n\n**Limitations**:\n* Error handling is limited, incorrect URLs can crash the application.\n* By default no security access is provided to the data, HTTPS must be explicitly configured.")
@com.ibm.streams.operator.model.OutputPorts(value={@com.ibm.streams.operator.model.OutputPortSet(cardinality=1, description="Emits a tuple for each POST request on the inject URL with port index 0"), @com.ibm.streams.operator.model.OutputPortSet(optional=true, description="Optional additional ports that emit a tuple for each POST request on the inject URL with the corresponding port index")})
@com.ibm.streams.operator.model.Icons(location32="icons/HTTPTupleInjection_32.gif", location16="icons/HTTPTupleInjection_16.gif")
@com.ibm.streams.operator.internal.model.ShadowClass("com.ibm.streamsx.inet.rest.ops.PostJSON")
@javax.annotation.Generated("com.ibm.streams.operator.internal.model.processors.ShadowClassGenerator")
public class PostJSON$StreamsModel extends com.ibm.streams.operator.AbstractOperator
 {

@com.ibm.streams.operator.model.Parameter(optional=true, description="Port number for the embedded Jetty HTTP server. Defaults to 8080.")
@com.ibm.streams.operator.internal.model.MethodParameters({"port"})
public void setPort(int port) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Define a URL context path that maps to the resources defined by`contextResourceBase`. This allows a composite that invokes this operator in a toolkit to provide resources regardless of the value of the application's data directory. For example setting it to *maps* would result in the URL */maps/index.html* mapping to the file *index.html* in the directory defined by `contextResourceBase`. Requires the parameter `contextResourceBase` to be set. If when the operator is initialized the context already exists then no action is taken. This allows multiple independent composites in the same toolkit to have common `context` and `contextResourceBase` settings, typically to point to a single set of HTML and Javascript resources for the toolkit.\n\nIf the operator provides URLs for its input or output ports then they are placed in the this context when this parameter is set. This then provides fixed locations for the URLs regardless of the depth of the operator invocation in the main composite.\n\nOnly a single context per invocation is supported.")
@com.ibm.streams.operator.internal.model.MethodParameters({"context"})
public void setContext(java.lang.String context) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Directory location of resources that will be available through the the URL context defined by the parameter `context`. Typically used to allow a toolkit to provide a set of resources in a fixed location. The set of resources is recommended to be stored in the application_dir/opt directory, which is automatically included in the bundle by default. Path of this directory can be absolute or relative, if relative path is specified then it is relative to the application directory. A set of default resources is included in the toolkit directory under ToolkitDir/opt/resources and will be loaded by the operator. This default resources can be viewed at `http://hostname:8080/streamsx.inet.resources`. A path within the application is obtained using the SPL function `getThisToolkitDir()`. Thus a composite in the file *maps.spl* in the namespace directory `com.acme.streams.apps.map` might have the following setting to map `http://127.0.0.1:8080/maps` to `opt/resources/mapinfo` in the application.\n\n    param\n      context: “maps”\n      contextResourceBase: getThisToolkitDir() + “/opt/resources/mapinfo”\n")
@com.ibm.streams.operator.internal.model.MethodParameters({"base"})
public void setContextResourceBase(java.lang.String base) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Alias of the certificate to use in the key store. When this parameter is set all connections use HTTPS.")
@com.ibm.streams.operator.internal.model.MethodParameters({"ca"})
public void setCertificateAlias(java.lang.String ca) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="URL to the key store containing the certificate. If a relative file path then it is taken as relative to the application directory.")
@com.ibm.streams.operator.internal.model.MethodParameters({"ks"})
public void setKeyStore(java.lang.String ks) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Password to the key store.")
@com.ibm.streams.operator.internal.model.MethodParameters({"ksp"})
public void setKeyStorePassword(java.lang.String ksp) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Password to the certificate. If not provided, defaults to the value of `keyStorePassword`.")
@com.ibm.streams.operator.internal.model.MethodParameters({"kp"})
public void setKeyPassword(java.lang.String kp) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="URL to the trust store containing client certificates. If a relative file path then it is taken as relative to the application directory. When this parameter is set, client authentication is required.")
@com.ibm.streams.operator.internal.model.MethodParameters({"ks"})
public void setTrustStore(java.lang.String ks) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Password to the trust store.")
@com.ibm.streams.operator.internal.model.MethodParameters({"ksp"})
public void setTrustStorePassword(java.lang.String ksp) {}

@com.ibm.streams.operator.model.CustomMetric(description="Jetty (HTTP/HTTPS) server port", kind=Kind.GAUGE)
@com.ibm.streams.operator.internal.model.MethodParameters({"metric"})
public void setServerPort(com.ibm.streams.operator.metrics.Metric metric) {}

@com.ibm.streams.operator.model.CustomMetric(description="Jetty SSL/TLS status: 0=HTTP, 1=HTTPS", kind=Kind.GAUGE)
@com.ibm.streams.operator.internal.model.MethodParameters({"metric"})
public void setHttps(com.ibm.streams.operator.metrics.Metric metric) {}
}