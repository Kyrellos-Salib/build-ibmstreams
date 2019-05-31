package com.ibm.streamsx.inet.httpjson;
import com.ibm.streams.operator.metrics.Metric.Kind;
import com.ibm.streams.operator.model.InputPortSet.WindowMode;
import com.ibm.streams.operator.model.InputPortSet.WindowPunctuationInputMode;
import com.ibm.streams.operator.model.OutputPortSet.WindowPunctuationOutputMode;

@com.ibm.streams.operator.model.PrimitiveOperator(description="Periodically connects to an HTTP endpoint to GET JSON content as a single tuple. The JSON content is assigned  to the `jsonString` attribute in the output tuple which must be of type `rstring`.\n\n**This operator will be deprecated.** Use a combination of HTTPRequest and Beacon operator instead.", namespace="com.ibm.streamsx.inet.http")
@com.ibm.streams.operator.model.OutputPortSet(cardinality=1, windowPunctuationOutputMode=WindowPunctuationOutputMode.Free, description="Content of the HTTP GET request as an JSON attribute. Each successful HTTP request that returns a content results in a submitted tuple with an rstring attribute containing the returned content.")
@com.ibm.streams.operator.model.Icons(location32="icons/HTTPGetXMLContent_32.gif", location16="icons/HTTPGetXMLContent_16.gif")
@com.ibm.streams.operator.internal.model.ShadowClass("com.ibm.streamsx.inet.httpjson.HTTPGetJSONContent")
@javax.annotation.Generated("com.ibm.streams.operator.internal.model.processors.ShadowClassGenerator")
public class HTTPGetJSONContent$StreamsModel extends com.ibm.streams.operator.AbstractOperator
 {

@com.ibm.streams.operator.model.Parameter(optional=true, description="Delay in seconds before the operator starts producing tuples.")
@com.ibm.streams.operator.internal.model.MethodParameters({"delaySeconds"})
public void setInitDelay(long delaySeconds) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Polling period in seconds. Tuples will be fetched every `period` seconds.")
@com.ibm.streams.operator.internal.model.MethodParameters({"period"})
public void setPeriod(double period) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="The number of tuples to submit. Negative value or zero means continually fetch and submit tuples.")
@com.ibm.streams.operator.internal.model.MethodParameters({"iterations"})
public void setIterations(int iterations) {}

@com.ibm.streams.operator.model.Parameter(description="URL to HTTP GET content from.")
@com.ibm.streams.operator.internal.model.MethodParameters({"url"})
public void setUrl(java.lang.String url) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Extra headers to send with request, format is \"Header-Name: value\"")
@com.ibm.streams.operator.internal.model.MethodParameters({"extraHeaders"})
public void setExtraHeaders(java.util.List<java.lang.String> extraHeaders) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Accept all SSL certificates, even those that are self-signed. Setting this option will allow potentially insecure connections. Default is false.")
@com.ibm.streams.operator.internal.model.MethodParameters({"acceptAllCertificates"})
public void setAcceptAllCertificates(boolean acceptAllCertificates) {}

@com.ibm.streams.operator.model.CustomMetric(kind=Kind.COUNTER, description="Number of HTTP requests that failed, did not return response 200.")
@com.ibm.streams.operator.internal.model.MethodParameters({"nFailedRequests"})
public void setnFailedRequests(com.ibm.streams.operator.metrics.Metric nFailedRequests) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Output attribute to assign content to.")
@com.ibm.streams.operator.internal.model.MethodParameters({"contentAttribute"})
public void setContentAttribute(com.ibm.streams.operator.TupleAttribute<com.ibm.streams.operator.Tuple,java.lang.String> contentAttribute) {}
}