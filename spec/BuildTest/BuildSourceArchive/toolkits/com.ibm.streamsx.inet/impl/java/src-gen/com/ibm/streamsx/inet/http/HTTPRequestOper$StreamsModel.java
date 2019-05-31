package com.ibm.streamsx.inet.http;
import com.ibm.streams.operator.metrics.Metric.Kind;
import com.ibm.streams.operator.model.InputPortSet.WindowMode;
import com.ibm.streams.operator.model.InputPortSet.WindowPunctuationInputMode;
import com.ibm.streams.operator.model.OutputPortSet.WindowPunctuationOutputMode;

@com.ibm.streams.operator.model.PrimitiveOperator(namespace="com.ibm.streamsx.inet.http", name="HTTPRequest", description="Issue an HTTP request of the specified method for each input tuple. For method `NONE`, the request is suppressed. The URL and  method of the HTTP request either come from the input tuple using attributes specified by the `url` and `method` parameters or can be fixed using the `fixedUrl` and `fixedMethod` parameters. These parameters can be mixed, for example the URL can be fixed with `fixedUrl` while the method is set from each tuple using `method`.\nEntity enclosing requests (POST/PUT/PATCH) require a content type. The content type is specified with `contenType` or `fixedContentType` parameter. The default is `application/json`. The message body of an entity enclosing request can be defined in two ways:\n* Method POST: If the parameter `requestBodyAttribute` is defined and the value of the attribute is not empty, the value of the attribute is copied into the request body. Otherwise the names and values of the Request Attributes are used to generate the request form.\n* Other Methods: If the parameter `requestBodyAttribute` is defined, the value of the attribute is copied into the request body.\nThe operator can append Url Arguments to the request line. This happens if:\n* If parameter `requestUrlArgumentsAttribute` is specified and this attribute is not empty, the value of this attribute is copied as URL argument string and overwrites all other arguments. (all methods)\n* In method GET: If parameter `requestAttributesAsUrlArguments` is true, all Request Attribute names and values are converted to URL query parameters.\nThe content of the request is dependent on the method type.\n# GET\nAn HTTP GET request is made. If parameter `requestAttributesAsUrlArguments` is true, all request attributes are converted to URL query parameters. If parameter `requestUrlArgumentsAttribute` is specified and this attribute is not empty, this attribute is copied as URL argument string and overwrites all other arguments.\n# POST\nAn HTTP POST request is made, any request attributes are set as the body of the request message if parameter `requestBodyAttribute` is not present or the value of the attribute is empty. The encoding of the request body takes the content type into account. If content type is `application/json`, a json body is generated from request attributes. If content type is `application/x-www-form-urlencoded`, a url-encoded body is generated from request attributes. For all other content types, the content of all request attributes is concatenated into the message body. If `requestBodyAttribute` attribute is not empty, the body of the request is copied from this attribute instead.\n# PUT\nAn HTTP PUT request is made, the body of the request message is copied from `requestBodyAttribute` attribute.\n# PATCH\nAn HTTP PATCH request is made, the body of the request message is copied from `requestBodyAttribute` attribute.\n# OPTIONS\nNo message body is generated.\n# HEAD\nAn HTTP HEAD request is made.\n# DELETE\nNo message body is generated.\n# TRACE\nNo message body is generated.\n# NONE\nNo http request is generated but an output tuple is submitted if the output port is present and attributes are passed from input port to output port.\n# Request Attributes\nAttributes from the input tuple are request parameters except for:\n* Any attribute specified by parameters `url`, `method`, `contentType`, `requestBodyAttribute` or `equestUrlArguments`.\n* If parameter `requestAttributes` is set, all attributes of this parameter are considered a request attribute.\n* If parameter `requestAttributes` has one empty element, no attributes are considered a request attribute.\n# Http Authentication\nThe operator supports the following authentication methods: Basic, Digest, OAuth1a and OAuth2.0; see parameter `authenticationType`.\n# Behavior in a consistent region\nThis operator cannot be used inside a consistent region.")
@com.ibm.streams.operator.model.Libraries(value={"opt/httpcomponents-client-4.5.5/lib/*"})
@com.ibm.streams.operator.model.Icons(location32="icons/HTTPPost_32.gif", location16="icons/HTTPPost_16.gif")
@com.ibm.streams.operator.model.InputPorts(value={@com.ibm.streams.operator.model.InputPortSet(cardinality=1, description="This stream contains the information sent in a http request. Each tuple with valid request data results in an HTTP request except if method `NONE` is specified.")})
@com.ibm.streams.operator.model.OutputPorts(value={@com.ibm.streams.operator.model.OutputPortSet(cardinality=1, optional=true, windowPunctuationOutputMode=WindowPunctuationOutputMode.Preserving, description="Data received in the http response be sent on this port. Other attributes are assigned from input stream.")})
@com.ibm.streams.operator.internal.model.ShadowClass("com.ibm.streamsx.inet.http.HTTPRequestOper")
@javax.annotation.Generated("com.ibm.streams.operator.internal.model.processors.ShadowClassGenerator")
public class HTTPRequestOper$StreamsModel extends com.ibm.streams.operator.AbstractOperator
 {

@com.ibm.streams.operator.model.Parameter(optional=true, description="Attribute that specifies the URL to be used in the HTTP request for a tuple. One and only one of `url` and `fixedUrl` must be specified.")
@com.ibm.streams.operator.internal.model.MethodParameters({"url"})
public void setUrl(com.ibm.streams.operator.TupleAttribute<com.ibm.streams.operator.Tuple,java.lang.String> url) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Fixed URL to send HTTP requests to. Any tuple received on the input port results in a request to the URL provided (except for method NONE). One and only one of `url` and `fixedUrl` must be specified.")
@com.ibm.streams.operator.internal.model.MethodParameters({"fixedUrl"})
public void setFixedUrl(java.lang.String fixedUrl) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Attribute that specifies the method to be used in the HTTP request for a tuple. One and only one of `method` and `fixedMethod` must be specified.")
@com.ibm.streams.operator.internal.model.MethodParameters({"method"})
public void setMethod(com.ibm.streams.operator.TupleAttribute<com.ibm.streams.operator.Tuple,java.lang.String> method) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Fixed method for each HTTP request. Every HTTP request  uses the method provided. One and only one of `method` and `fixedMethod` must be specified.")
@com.ibm.streams.operator.internal.model.MethodParameters({"fixedMethod"})
public void setFixedMethod(com.ibm.streamsx.inet.http.HTTPMethod fixedMethod) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Fixed MIME content type of entity for `POST` and `PUT` requests. Only one of `contentType` and `fixedContentType` must be specified. Defaults to `application/json`.")
@com.ibm.streams.operator.internal.model.MethodParameters({"fixedContentType"})
public void setFixedContentType(java.lang.String fixedContentType) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="MIME content type of entity for `POST` and `PUT` requests. Only one of `contentType` and `fixedContentType` must be specified. Defaults to `application/json`.")
@com.ibm.streams.operator.internal.model.MethodParameters({"contentType"})
public void setContentType(com.ibm.streams.operator.TupleAttribute<com.ibm.streams.operator.Tuple,java.lang.String> contentType) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Extra headers to send with request, format is `Header-Name: value`.")
@com.ibm.streams.operator.internal.model.MethodParameters({"extraHeaders"})
public void setExtraHeaders(java.util.List<java.lang.String> extraHeaders) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Names of the attributes which are part of the request body. The content of these attributes is sent as request body in method POST. If parameter `requestAttributesAsUrlArguments` is true, the request attributes are additionally appended as arguments to the url in method GET. If this parameter is missing, all attributes, excluding those that are used to specify the URL, method, content type, Request url arguments or request attributes, are used in the request body. One empty element defines an empty list which means no attributes are considered request attributes. ")
@com.ibm.streams.operator.internal.model.MethodParameters({"requestAttributes"})
public void setRequestAttributes(java.lang.String[] requestAttributes) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="If this parameter is true, the request attributes are appended as arguments to the url in method GET. If this parameter is false, the request attributes are not appended to the url. Default is false. These arguments are overwritten from a non-empty value in parameter `requestUrlArgumentsAttribute`.")
@com.ibm.streams.operator.internal.model.MethodParameters({"requestAttributesAsUrlArguments"})
public void setRequestAttributesAsUrlArguments(boolean requestAttributesAsUrlArguments) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Request url arguments attribute. If this parameter is set and the value of this attribute  is not empty, the content of this string is appended as arguments to the request url. This overwrites the arguments which are generated from the request attributes. The value is expected to be unescaped and may contain non-ASCII characters")
@com.ibm.streams.operator.internal.model.MethodParameters({"requestUrlArgumentsAttribute"})
public void setRequestUrlArgumentsAttribute(com.ibm.streams.operator.TupleAttribute<com.ibm.streams.operator.Tuple,java.lang.String> requestUrlArgumentsAttribute) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Request body attribute for any method that accepts an entity (PUT / POST / PATCH). In method PUT and PATCH the body of request is taken from this attribute. In method POST, any non-empty value overwrites the request attributes.")
@com.ibm.streams.operator.internal.model.MethodParameters({"requestBodyAttribute"})
public void setRequestBodyAttribute(com.ibm.streams.operator.TupleAttribute<com.ibm.streams.operator.Tuple,java.lang.String> requestBodyAttribute) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Name of the attribute to populate one line of the response data with. If this parameter is set, the operators returns one tuple for each line in the response body but at least one tuple if the body is empty. Only one of `outputDataLine` and `outputBody` must be specified. This parameter is not allowed if the operator has no output port.")
@com.ibm.streams.operator.internal.model.MethodParameters({"outputDataLine"})
public void setOutputDataLine(java.lang.String outputDataLine) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Name of the attribute to populate the response body with. If this parameter is set, the operators returns one tuple for each request. Only one of `outputDataLine` and `outputBody` must be specified. This parameter is not allowed if the operator has no output port.If this parameter is set and parameter `outputBodyRaw` is set, all responses with entitiy mime type not equal to `application/octet-stream` or `default/binary` generate output here.")
@com.ibm.streams.operator.internal.model.MethodParameters({"outputBody"})
public void setOutputBody(java.lang.String outputBody) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Name of the attribute to populate the raw response body with. The type of this attribute must be `blob`. Only one of `outputDataLine` and `outputBodyRaw` must be specified. This parameter is not allowed if the operator has no output port. You may use `outputBodyRaw` and `outputBody`.If this parameter is set and parameter `outputBody` is set, all responses with entitiy mime type equal to `application/octet-stream` or `default/binary` will generate output here.")
@com.ibm.streams.operator.internal.model.MethodParameters({"outputBodyRaw"})
public void setOutputBodyRaw(java.lang.String outputBodyRaw) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Name of the attribute to populate the response status line with. This parameter is not allowed if the operator has no output port. ")
@com.ibm.streams.operator.internal.model.MethodParameters({"outputStatus"})
public void setOutputStatus(java.lang.String outputStatus) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Name of the attribute to populate the response status code as integer with. The type of this attribute must be int32. This is the numerical value from the http response or -1 if no response was received. This parameter is not allowed if the operator has no output port. ")
@com.ibm.streams.operator.internal.model.MethodParameters({"outputStatusCode"})
public void setOutputStatusCode(java.lang.String outputStatusCode) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Name of the attribute to populate the response header information with. The type of this attribute must be string list. This parameter is not allowed if the operator has no output port. ")
@com.ibm.streams.operator.internal.model.MethodParameters({"outputHeader"})
public void setOutputHeader(java.lang.String outputHeader) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Name of the attribute to populate the response content encoding header with. This parameter is not allowed if the operator has no output port. ")
@com.ibm.streams.operator.internal.model.MethodParameters({"outputContentEncoding"})
public void setOutputContentEncoding(java.lang.String outputContentEncoding) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Name of the attribute to populate the response entity mime type with. This parameter is not allowed if the operator has no output port. ")
@com.ibm.streams.operator.internal.model.MethodParameters({"outputContentType"})
public void setOutputContentType(java.lang.String outputContentType) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Name of the attribute to populate the response entity charset with. This parameter is not allowed if the operator has no output port. ")
@com.ibm.streams.operator.internal.model.MethodParameters({"outputCharSet"})
public void setOutputCharSet(java.lang.String outputCharSet) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Name of the attribute to populate the error diagnostics with. This string contains the diagnostics information when the program execution of the http operation throws an exception. This string is empty when a http response was received. The status line of the http response is issued in the `dataStatus` attribute.")
@com.ibm.streams.operator.internal.model.MethodParameters({"errorDiagnostics"})
public void setErrorDiagnostics(java.lang.String errorDiagnostics) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="The type of used authentication method. Valid options are \"STANDARD\", \"OAUTH1,\" and \"OAUTH2\". Default is \"STANDARD\". If \"STANDARD\" is selected, the authorization may be none, basic or digest authorization. If the server requires basic or digest authorization one of the parameters `authenticationFile` or `authenticationProperties` is required. If the \"OAUTH1\" option is selected, the requests will be singed using OAuth 1.0a If the \"OAUTH2\" option is selected, the requests will be singed using OAuth 2.0.")
@com.ibm.streams.operator.internal.model.MethodParameters({"authenticationType"})
public void setAuthenticationType(java.lang.String authenticationType) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Path to the properties file containing authentication information. Authentication file is recommended to be stored in the application_dir/etc directory. Path of this file can be absolute or relative, if relative path is specified then it is relative to the application directory. The content of this file depends on the `authenticationType`.\n* If `authenticationType` is `STANDARD`: A valid line is composed from the authentication Scope (hostname or `ANY_HOST`, equal sign, user, colon, password. E.g.: ANY_HOST=user:passwd\n* If `authenticationType` is `OAUTH1`: The authentication file must contain key/value pairs for the keys: `consumerKey`, `consumerSecret`, `accessToken` and `accessTokenSecret`.\n* If `authenticationType` is `OAUTH2`: The authentication file must contain one key/value pair for key `accessToken=myAccessToken`.\nThe authentication file may contain one key/value pair for key `authMethod`.\nSee `http_request_auth.properties`, `http_request_oauth1.properties` and `http_request_oauth2.properties` in the toolkits etc directory for a sample of authentication properties.")
@com.ibm.streams.operator.internal.model.MethodParameters({"val"})
public void setAuthenticationFile(java.lang.String val) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Properties to override those in the authentication file.")
@com.ibm.streams.operator.internal.model.MethodParameters({"authenticationProperties"})
public void setAuthenticationProperties(java.util.List<java.lang.String> authenticationProperties) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Accept all SSL certificates, even those that are self-signed. If this parameter is set, parameter `sslTrustStoreFile` is not allowed. Setting this option will allow potentially insecure connections. Default is false.")
@com.ibm.streams.operator.internal.model.MethodParameters({"sslAcceptAllCertificates"})
public void setSslAcceptAllCertificates(boolean sslAcceptAllCertificates) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Path to .jks trust store file used for TODO: ?server? and client authentication. If this parameter is set, parameter `sslTrustStorePassword` is required.")
@com.ibm.streams.operator.internal.model.MethodParameters({"sslTrustStoreFile"})
public void setSslTrustStoreFile(java.lang.String sslTrustStoreFile) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Password for the trust store and the keys it contains")
@com.ibm.streams.operator.internal.model.MethodParameters({"sslTrustStorePassword"})
public void setSslTrustStorePassword(java.lang.String sslTrustStorePassword) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Hostname of the http-proxy to be used. If this parameter is omitted no proxy is used.")
@com.ibm.streams.operator.internal.model.MethodParameters({"proxy"})
public void setProxy(java.lang.String proxy) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="The proxy-port to be used. Default value is 8080. This parameter is ignored if no `proxy` parameter is specified.")
@com.ibm.streams.operator.internal.model.MethodParameters({"proxyPort"})
public void setProxyPort(int proxyPort) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Set the redirection strategy. Possible values are:\n* DEFAULT: This enables the automatic redirect handling. This strategy honors the restrictions on automatic redirection of entity enclosing methods such as POST and PUT imposed by the HTTP specification. 302 Moved Temporarily, 301 Moved Permanently and 307 Temporary Redirect status codes will result in an automatic redirect of HEAD and GET methods only. POST and PUT methods will not be automatically redirected as requiring user confirmation.\n* LAX: This relaxes the default settings and enables the automatic redirection of all HEAD, GET, POST, and DELETE requests.\n* NONE: This disables the automatic redirection handling.\nThis parameter must not be used together with parameter `disableRedirectHandling`. Default is `DEFAULT`")
@com.ibm.streams.operator.internal.model.MethodParameters({"redirectStrategy"})
public void setRedirectStrategy(java.lang.String redirectStrategy) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Disables automatic redirect handling. Default is false. This parameter must not be used together with parameter `redirectStrategy`")
@com.ibm.streams.operator.internal.model.MethodParameters({"disableRedirectHandling"})
public void setDisableRedirectHandling(boolean disableRedirectHandling) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Disables automatic content decompression. Default is false")
@com.ibm.streams.operator.internal.model.MethodParameters({"disableContentCompression"})
public void setDisableContentCompression(boolean disableContentCompression) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Disables automatic request recovery and re-execution. Default is false")
@com.ibm.streams.operator.internal.model.MethodParameters({"disableAutomaticRetries"})
public void setDisableAutomaticRetries(boolean disableAutomaticRetries) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Set the connection timeout in milliseconds. If value is 0, the default connection timeout is used. Default is 0.")
@com.ibm.streams.operator.internal.model.MethodParameters({"connectionTimeout"})
public void setConnectionTimeout(int connectionTimeout) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="Assigns the header User-Agent value. Default is \"Apache-HttpClient/4.5.5 (Java/1.8.0)\"")
@com.ibm.streams.operator.internal.model.MethodParameters({"userAgent"})
public void setUserAgent(java.lang.String userAgent) {}

@com.ibm.streams.operator.model.CustomMetric(kind=Kind.COUNTER, description="The number of request transmit attempts.")
@com.ibm.streams.operator.internal.model.MethodParameters({"nRequestTransmit"})
public void setnRequestTransmit(com.ibm.streams.operator.metrics.Metric nRequestTransmit) {}

@com.ibm.streams.operator.model.CustomMetric(kind=Kind.COUNTER, description="The number of received responses with result code: success (2xx).")
@com.ibm.streams.operator.internal.model.MethodParameters({"nResponseSuccess"})
public void setnResponseSuccess(com.ibm.streams.operator.metrics.Metric nResponseSuccess) {}

@com.ibm.streams.operator.model.CustomMetric(kind=Kind.COUNTER, description="The number of received responses with result codes other than success.")
@com.ibm.streams.operator.internal.model.MethodParameters({"nResponseNoSuccess"})
public void setnResponseNoSuccess(com.ibm.streams.operator.metrics.Metric nResponseNoSuccess) {}
}