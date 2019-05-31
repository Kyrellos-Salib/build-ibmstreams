package com.ibm.streamsx.inet.rest.ops;
import com.ibm.streams.operator.metrics.Metric.Kind;
import com.ibm.streams.operator.model.InputPortSet.WindowMode;
import com.ibm.streams.operator.model.InputPortSet.WindowPunctuationInputMode;
import com.ibm.streams.operator.model.OutputPortSet.WindowPunctuationOutputMode;

@com.ibm.streams.operator.model.SharedLoader()
@com.ibm.streams.operator.model.PrimitiveOperator(namespace="com.ibm.streamsx.inet.rest", name="HTTPRequestProcess", description="Operator accepts a web request and generates corresponding response.  The request is injected into streams on the output port, the input port receives the response.This enables a developer to process HTTP form's and REST calls. The request arrives on the output port, results are presented on the input port.The request is coorolated to the response with an attribute 'key' that arrives with the request parameters' on the output port and must accompany the response on the input port.\n\nThe URLs defined by this operator are:\n* *prefix*`/ports/analyze/`*port index*`/` - Injects a tuple into the output and the response is taken from the matching tuple on the input port.\n* *prefix*`/ports/input/`*port index*`/info` - Output port meta-data including the stream attribute names and types (content type `application/json`).\n\nThe *prefix* for the URLs is:\n* *context path*`/`*base operator name* - When the `context` parameter is set.\n* *full operator name* - When the `context` parameter is **not** set.\n\nFor the `analyze` path any HTTP method can be used and any sub-path. For example with a context of `api` and operator name of `Bus` then `api/Bus/ports/analyze/0/get_location` is valid.\n\nInput and output ports have two possible formats: tuple and json. With tuple format, each web input fields is mapped to an attribute. Json format has one attribute ('jsonString'), each web field is mapped to a json object field. \n\nThe jsonString object will be populated with all the fields. The default attribute names can beoverridden for tuple. \n\nThe operator handles two flavors of http requests, forms and REST. In the case of forms, webpages can be served up from the contextResourceBase, this can be to static html or template. . Refer to the spl example for a form processed by the operator using a template to format the response.\n\n For the input port (the web response), only the 'key' is mandatory for both json and tuple. The following lists the default values if the field or attribute is not provided. \n* rstring response : 0 length response.  \n* int32 statusCode : 200 (OK) \n* rstring statusMessage :  not set \n* rstring contentType : 'text/html; charset=utf-8'. \n* Map<rstring,rstring> headers : No headers provided \n \n\n # Notes:\n\n * The 'key' attribute on the output and input port's are correlated. Losing the correlation loses the request.\n * If the input port's response key cannot be located the web request will timeout, metrics will be incremented.\n * If the input jsonString value cannot be converted to an jsonObject, no response will be generated and web request will timeout.\n * Only the first input port's key will produce a web response.\n * The 'jsonString' attribute json field names are the default attribute names.\n * context/pathInfo relationship : A request's context path beyond the base is accepted, the 'pathInfo' attribute will have path beyond the base.    If the context path is */work* requests to */work/translate* will have a 'pathInfo' of */translate* and requests   to */work/translate/speakeasy* will have a 'pathInfo' of */translate/speakeasy*. \n\n")
@com.ibm.streams.operator.model.InputPorts(value={@com.ibm.streams.operator.model.InputPortSet(description="Response to be returned to the web requestor.", cardinality=1, optional=false, controlPort=true, windowingMode=WindowMode.NonWindowed, windowPunctuationInputMode=WindowPunctuationInputMode.Oblivious)})
@com.ibm.streams.operator.model.OutputPorts(value={@com.ibm.streams.operator.model.OutputPortSet(description="Request from web to process.", cardinality=1, optional=false, windowPunctuationOutputMode=WindowPunctuationOutputMode.Generating)})
@com.ibm.streams.operator.model.Icons(location32="icons/HTTPTupleRequest_32.jpeg", location16="icons/HTTPTupleRequest_16.jpeg")
@com.ibm.streams.operator.internal.model.ShadowClass("com.ibm.streamsx.inet.rest.ops.RequestProcess")
@javax.annotation.Generated("com.ibm.streams.operator.internal.model.processors.ShadowClassGenerator")
public class RequestProcess$StreamsModel extends com.ibm.streams.operator.AbstractOperator
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

@com.ibm.streams.operator.model.CustomMetric(description="Number of requests received from web.", kind=Kind.COUNTER)
@com.ibm.streams.operator.internal.model.MethodParameters({"nMessagesReceived"})
public void setnMessagesReceived(com.ibm.streams.operator.metrics.Metric nMessagesReceived) {}

@com.ibm.streams.operator.model.CustomMetric(description="Number of vaild responses sent back via web.", kind=Kind.COUNTER)
@com.ibm.streams.operator.internal.model.MethodParameters({"nMessagesResponded"})
public void setnMessagesResponded(com.ibm.streams.operator.metrics.Metric nMessagesResponded) {}

@com.ibm.streams.operator.model.CustomMetric(description="Missing tracking key count..", kind=Kind.COUNTER)
@com.ibm.streams.operator.internal.model.MethodParameters({"nMissingTrackingKey"})
public void setnMissingTrackingKey(com.ibm.streams.operator.metrics.Metric nMissingTrackingKey) {}

@com.ibm.streams.operator.model.CustomMetric(description="Number of timeouts waiting for response from Streams.", kind=Kind.COUNTER)
@com.ibm.streams.operator.internal.model.MethodParameters({"nRequestTimeouts"})
public void setnRequestTimeouts(com.ibm.streams.operator.metrics.Metric nRequestTimeouts) {}

@com.ibm.streams.operator.model.CustomMetric(description="Number of requests currently being processed.", kind=Kind.GAUGE)
@com.ibm.streams.operator.internal.model.MethodParameters({"metric"})
public void setnActiveRequests(com.ibm.streams.operator.metrics.Metric metric) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Number of seconds to wait for the web request to be processed by Streams, default: \"15.0\".  ")
@com.ibm.streams.operator.internal.model.MethodParameters({"webTimeout"})
public void setWebTimeout(double webTimeout) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description=" Input and output port's corrolation key. The values is expected to be unchanged between the input and output, default: \"key\". ")
@com.ibm.streams.operator.internal.model.MethodParameters({"keyAttributeName"})
public void setKeyAttributeName(java.lang.String keyAttributeName) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Output ports's attribute name with the request method (PUT, GET, POST), default: \"method\".  ")
@com.ibm.streams.operator.internal.model.MethodParameters({"methodAttributeName"})
public void setMethodAttributeName(java.lang.String methodAttributeName) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Output ports's attribute of the content path below the base, default \"pathInfo\".  ")
@com.ibm.streams.operator.internal.model.MethodParameters({"pathInfoAttributeName"})
public void setPathInfoAttributeName(java.lang.String pathInfoAttributeName) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Output port's attribute name with the web request (body of the web request), default \"request\".  ")
@com.ibm.streams.operator.internal.model.MethodParameters({"requestAttributeName"})
public void setRequestAttributeName(java.lang.String requestAttributeName) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Output port's web request headers, in the form of a objects<name, value>, default: \"header\".  ")
@com.ibm.streams.operator.internal.model.MethodParameters({"headerAttributeName"})
public void setHeaderAttributeName(java.lang.String headerAttributeName) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Output port's attribute with content-type will be provided in, default: \"contentType\".  ")
@com.ibm.streams.operator.internal.model.MethodParameters({"contentTypeAttributeName"})
public void setContentTypeAttributeName(java.lang.String contentTypeAttributeName) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Input port's attribute response (body of the web response), default:  \"response\".  ")
@com.ibm.streams.operator.internal.model.MethodParameters({"responseAttributeName"})
public void setResponseAttributeName(java.lang.String responseAttributeName) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Input port's json results (complete response), default:  \"jsonString\".  ")
@com.ibm.streams.operator.internal.model.MethodParameters({"jsonAttributeName"})
public void setResponseJsonAttributeName(java.lang.String jsonAttributeName) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Input port's attribute web status, default:  \"status\".  ")
@com.ibm.streams.operator.internal.model.MethodParameters({"statusAttributeName"})
public void setStatusAttributeName(java.lang.String statusAttributeName) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Input port's web status message response, when the 'status' value is >= 400 (SC_BAD_REQUEST), default:  \"statusMessage\".  ")
@com.ibm.streams.operator.internal.model.MethodParameters({"statusMessageAttributeName"})
public void setStatusMessageAttributeName(java.lang.String statusMessageAttributeName) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Input port's web response header objects<name,value>, default: \"header\".  ")
@com.ibm.streams.operator.internal.model.MethodParameters({"responseHeaderAttributeName"})
public void setResponseHeaderAttributeName(java.lang.String responseHeaderAttributeName) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Input port's web response content type, default: \"contentType\".  ")
@com.ibm.streams.operator.internal.model.MethodParameters({"responseContentType"})
public void setResponseContentTypeAttributeName(java.lang.String responseContentType) {}
}