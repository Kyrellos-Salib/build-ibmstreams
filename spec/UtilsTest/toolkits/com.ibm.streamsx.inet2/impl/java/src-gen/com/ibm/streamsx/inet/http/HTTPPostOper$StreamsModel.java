package com.ibm.streamsx.inet.http;
import com.ibm.streams.operator.metrics.Metric.Kind;
import com.ibm.streams.operator.model.InputPortSet.WindowMode;
import com.ibm.streams.operator.model.InputPortSet.WindowPunctuationInputMode;
import com.ibm.streams.operator.model.OutputPortSet.WindowPunctuationOutputMode;

@com.ibm.streams.operator.model.InputPorts(value={@com.ibm.streams.operator.model.InputPortSet(cardinality=1, description="By default, all attributes of the input stream are sent as POST data to the specified HTTP server.")})
@com.ibm.streams.operator.model.OutputPorts(value={@com.ibm.streams.operator.model.OutputPortSet(cardinality=1, optional=true, description="Emits a tuple containing the reponse received from the server and assignments automatically forwarded from the input. Tuple structure must conform to the [HTTPResponse] type specified in this namespace. Additional attributes with corresponding input attributes will be forwarded before the POST request.")})
@com.ibm.streams.operator.model.PrimitiveOperator(namespace="com.ibm.streamsx.inet.http", name="HTTPPost", description="This operator sends incoming tuples to the specified HTTP server as part of a POST request. A single tuple will be sent as a body of one HTTP POST request. Certain authentication modes are supported. Tuples are sent to the server one at a time in order of receipt. If the HTTP server cannot be accessed, the operation will be retried on the current thread and may temporarily block any additional tuples that arrive on the input port. By default, the data is sent in application/x-www-form-urlencoded UTF-8 encoded format.\n\n**Behavior in a consistent region**\n\n\nThis operator cannot be placed at the start of a consistent region.\n\n**This operator will be deprecated.** Use HTTPRequest operator instead.")
@com.ibm.streams.operator.model.Libraries(value={"opt/downloaded/*"})
@com.ibm.streams.operator.model.Icons(location32="icons/HTTPPost_32.gif", location16="icons/HTTPPost_16.gif")
@com.ibm.streams.operator.internal.model.ShadowClass("com.ibm.streamsx.inet.http.HTTPPostOper")
@javax.annotation.Generated("com.ibm.streams.operator.internal.model.processors.ShadowClassGenerator")
public class HTTPPostOper$StreamsModel extends com.ibm.streams.operator.AbstractOperator
 {

@com.ibm.streams.operator.model.Parameter(optional=false, description="URL to connect to")
@com.ibm.streams.operator.internal.model.MethodParameters({"url"})
public void setUrl(java.lang.String url) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Valid options are \"basic\" and \"none\". Default is \"none\".")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setAuthenticationType(java.lang.String val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Path to the properties file containing authentication information. Authentication file is recommended to be stored in the application_dir/etc directory. Path of this file can be absolute or relative, if relative path is specified then it is relative to the application directory. See http_auth_basic.properties in the toolkits etc directory for a sample of basic authentication properties.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setAuthenticationFile(java.lang.String val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Properties to override those in the authentication file.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setAuthenticationProperty(java.util.List<java.lang.String> val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Path to .jks file used for server and client authentication")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setKeyStoreFile(java.lang.String val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Password for the keyStore and the keys it contains")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setKeyStorePassword(java.lang.String val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Maximum number of retries in case of failures/disconnects.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setMaxRetries(int val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Wait time between retries in case of failures/disconnects.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setRetryDelay(double val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Optional parameter specifies amount of time (in seconds) that the operator waits for the connection for to be established. Default is 60.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setConnectionTimeout(double val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Set the content type of the HTTP request.  If the value is set to \"application/json\" then the entire tuple is sent in JSON format using SPL's standard tuple to JSON encoding, if the input schema is `tuple<rstring jsonString>` then `jsonString` is assumed to already be JSON and its value is sent as the content.  Default is \"application/x-www-form-urlencoded\". Note that if a value other than the above mentioned ones is specified, the input stream can only have a single attribute.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setHeaderContentType(java.lang.String val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Extra headers to send with request, format is \"Header-Name: value\".")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setExtraHeaders(java.util.List<java.lang.String> val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Accept all SSL certificates, even those that are self-signed. Setting this option will allow potentially insecure connections. Default is false.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setAcceptAllCertificates(boolean val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Specify attributes used to compose the POST. Comma separated list of attribute names that will be posted to the url. The parameter is invalid if HeaderContentType is not \"application/json\" or \"application/x-www-form-urlencoded\". Default is to send all attributes.")
@com.ibm.streams.operator.internal.model.MethodParameters({"include"})
public void setInclude(java.util.List<com.ibm.streams.operator.TupleAttribute<com.ibm.streams.operator.Tuple,?>> include) {}
}