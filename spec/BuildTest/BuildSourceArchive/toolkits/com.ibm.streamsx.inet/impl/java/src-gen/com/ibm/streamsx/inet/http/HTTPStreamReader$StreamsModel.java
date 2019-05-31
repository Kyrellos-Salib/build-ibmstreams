package com.ibm.streamsx.inet.http;
import com.ibm.streams.operator.metrics.Metric.Kind;
import com.ibm.streams.operator.model.InputPortSet.WindowMode;
import com.ibm.streams.operator.model.InputPortSet.WindowPunctuationInputMode;
import com.ibm.streams.operator.model.OutputPortSet.WindowPunctuationOutputMode;

@com.ibm.streams.operator.model.OutputPorts(value={@com.ibm.streams.operator.model.OutputPortSet(cardinality=1, optional=false, windowPunctuationOutputMode=WindowPunctuationOutputMode.Generating, description="Data received from the server will be sent on this port."), @com.ibm.streams.operator.model.OutputPortSet(cardinality=1, optional=true, windowPunctuationOutputMode=WindowPunctuationOutputMode.Free, description="Error information will be sent out on this port including the response code and any message recieved from the server. Tuple structure must conform to the [HTTPResponse] type specified in this namespace.")})
@com.ibm.streams.operator.model.PrimitiveOperator(namespace="com.ibm.streamsx.inet.http", name="HTTPGetStream", description="Connects to an HTTP endpoint, reads \"chunks\" of data and sends it to the output port. Every line read from the HTTP server endpoint is sent as a single tuple. If a connection is closed by the server, a WINDOW punctuation will be sent on port 0. Supported Authentications: Basic Authentication, OAuth 1.0a. Supported Compressions: Gzip, Deflate.\n\n**Behavior in a consistent region**\n\nThis operator cannot be used inside a consistent region.\n\n**This operator will be deprecated.** Use a combination of HTTPRequest and Beacon operator instead.")
@com.ibm.streams.operator.model.Libraries(value={"opt/downloaded/*"})
@com.ibm.streams.operator.model.Icons(location32="icons/HTTPGetStream_32.gif", location16="icons/HTTPGetStream_16.gif")
@com.ibm.streams.operator.internal.model.ShadowClass("com.ibm.streamsx.inet.http.HTTPStreamReader")
@javax.annotation.Generated("com.ibm.streams.operator.internal.model.processors.ShadowClassGenerator")
public class HTTPStreamReader$StreamsModel extends com.ibm.streams.operator.AbstractOperator
 {

@com.ibm.streams.operator.model.Parameter(optional=false, description="URL endpoint to connect to.")
@com.ibm.streams.operator.internal.model.MethodParameters({"url"})
public void setUrl(java.lang.String url) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Valid options are \"oauth\", \"basic\" and \"none\". Default is \"none\". If the \"oauth\" option is selected, the requests will be singed using OAuth 1.0a.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setAuthenticationType(java.lang.String val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Path to the properties file containing authentication information. Authentication file is recommended to be stored in the application_dir/etc directory. Path of this file can be absolute or relative, if relative path is specified then it is relative to the application directory. See http_auth_basic.properties in the toolkits etc directory for a sample of basic authentication properties.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setAuthenticationFile(java.lang.String val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Properties to override those in the authentication file.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setAuthenticationProperty(java.util.List<java.lang.String> val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Maximum number of retries in case of failures/disconnects.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setMaxRetries(int val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Wait time between retries in case of failures/disconnects.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setRetryDelay(double val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="The value for this parameter will be sent to the server as a POST request body. The value is expected to be in \"key=value\" format. ")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setPostData(java.util.List<java.lang.String> val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Use a backoff function for increasing the wait time between retries. Wait times increase by a factor of 10. Default is false")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setBackoff(boolean val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Name of the attribute to populate the response data with. Default is \"data\"")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setDataAttributeName(java.lang.String val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Retry connecting if the connection has been closed. Default is false")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setRetryOnClose(boolean val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="By default the client will ask the server to compress its reponse data using supported compressions (gzip, deflate). Setting this option to true will disable compressions. Default is false.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setDisableCompression(boolean val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Extra headers to send with request, format is \"Header-Name: value\".")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setExtraHeaders(java.util.List<java.lang.String> val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Accept all SSL certificates, even those that are self-signed. Setting this option will allow potentially insecure connections. Default is false.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setAcceptAllCertificates(boolean val) {}
}