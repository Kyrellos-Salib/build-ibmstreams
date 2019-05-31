package com.ibm.streamsx.inet.rest.ops;
import com.ibm.streams.operator.metrics.Metric.Kind;
import com.ibm.streams.operator.model.InputPortSet.WindowMode;
import com.ibm.streams.operator.model.InputPortSet.WindowPunctuationInputMode;
import com.ibm.streams.operator.model.OutputPortSet.WindowPunctuationOutputMode;

@com.ibm.streams.operator.model.SharedLoader()
@com.ibm.streams.operator.model.PrimitiveOperator(namespace="com.ibm.streamsx.inet.rest", name="HTTPTupleView", description="REST HTTP or HTTPS API to view tuples from windowed input ports.\nEmbeds a Jetty web server to provide HTTP REST access to the collection of tuples in the input port window at the time of the last eviction for tumbling windows, or last trigger for sliding windows.\nThe URLs defined by this operator are:\n* *prefix*`/ports/input/`*port index*`/tuples` - Returns the set of tuples as a array of the tuples in JSON format (content type `application/json`).\n* *prefix*`/ports/input/`*port index*`/info` - Output port meta-data including the stream attribute names and types (content type `application/json`).\n\nThe *prefix* for the URLs is:\n* *context path*`/`*base operator name* - When the `context` parameter is set.\n* *full operator name* - When the `context` parameter is **not** set.\n\nThe `/tuples` URL accepts these optional query parameters:\n* `partition` – When the window is partitioned defines the partition to be extracted from the window. When partitionKey contains multiple attributes, partition must contain the same number of values as attributes and in the same order, e.g. `?partition=John&partition=Smith`. would match the SPL partitionKey setting of: `partitionKey: “firstName”, “lastName”;`. When a window is partitioned and no partition query parameter is provided the data for all partitions is returned.\n* `attribute` – Restricts the returned data to the named attributes. Data is returned in the order the attribute names are provided. When not provided, all attributes in the input tuples are returned. E.g. `?format=json&attribute=lastName&attribute=city` will return only the `lastName` and `city` attributes in that order with `lastName` first.\n* `suppress` – Suppresses the named attributes from the output. When not provided, no attributes are suppressed. suppress is applied after applying the query parameter attribute. E.g. `?suppress=firstName&suppress=lastName` will not include lastName or firstName in the returned data.\n* `callback` – Wrappers the returned JSON in a call to callbackvalue(...json...); to enable JSONP processing.\nQuery parameters are ignored if the input port's schema is `tuple<rstring jsonString>`.\n\nThe fixed URL `/ports/info` returns meta-data (using JSON) about all of the Streams ports that have associated URLs.\n\nTuples are converted to JSON using the `JSONEncoding` support from the Streams Java Operator API,\nexcept for: \n* If the input port's schema is `tuple<rstring jsonString>` then value is taken as is serialized JSON  and the resultant JSON is returned as the tuple's JSON value.\n* Within a tuple any attribute that is `rstring jsonString`, then the value is taken as serialized JSON and it is placed into the tuple's JSON object as its deserialized JSON with key `jsonString`.\n\n`HTTPTupleView`, [HTTPTupleInjection], [HTTPXMLInjection] and [WebContext] embed a Jetty webserver and all operator invocations in an SPL application that are co-located/fused in same partition (PE) will share a common Jetty instance. Thus by fusing these operators together with a common port value, a single web-server serving a single SPL application can be created. This sharing of the web-server by fusing multiple operators allows the operators to be logically connected in the SPL graph, rather than a single operator with multiple unrelated streams being connected to it.\n\nStatic content in the sub-directory `html` of the application's `opt` directory will also be served by the embedded web-server, thus allowing a complete web-application with live data to be served by an SPL application. The default URL for the web-server resolves to `{application_dir}/opt/html/index.html`.\n\nOperators that support the `context` and `contextResourceBase` SPL parameters will serve static files from the `contextResourceBase` directory rooted at the supplied context path.\n\n**Limitations**:\n* Error handling is limited, incorrect URLs can crash the application, e.g. providing the wrong number of partition values.\n* By default no security access is provided to the data, HTTPS must be explicitly configured.\n")
@com.ibm.streams.operator.model.InputPorts(value={@com.ibm.streams.operator.model.InputPortSet(cardinality=1, windowingMode=WindowMode.Windowed, windowPunctuationInputMode=WindowPunctuationInputMode.WindowBound, description="Windowed input port whose tuples will be available using a HTTP GET request with a URL using port index 0."), @com.ibm.streams.operator.model.InputPortSet(optional=true, windowingMode=WindowMode.Windowed, windowPunctuationInputMode=WindowPunctuationInputMode.WindowBound, description="Optional windowed input ports whose tuples will be available using a HTTP GET request a URL with the corresponding port index.")})
@com.ibm.streams.operator.model.Icons(location32="icons/HTTPTupleView_32.gif", location16="icons/HTTPTupleView_16.gif")
@com.ibm.streams.operator.internal.model.ShadowClass("com.ibm.streamsx.inet.rest.ops.TupleView")
@javax.annotation.Generated("com.ibm.streams.operator.internal.model.processors.ShadowClassGenerator")
public class TupleView$StreamsModel extends com.ibm.streams.operator.AbstractOperator
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

@com.ibm.streams.operator.model.Parameter(optional=true, cardinality=-1, description="Names of attributes to partition the window by. If the cardinality of this parameter is > 1,then every value represents one attribute name. If the cadinality equals to 1, the value may contain one attribute name or a comma separated list of attribute names.")
@com.ibm.streams.operator.internal.model.MethodParameters({"attributeNames"})
public void setPartitionKey(java.lang.String[] attributeNames) {}

@com.ibm.streams.operator.model.Parameter(optional=true, description="List of headers to insert into the http reply. Formatted as header:value")
@com.ibm.streams.operator.internal.model.MethodParameters({"headers"})
public void setHeaders(java.lang.String[] headers) {}
}