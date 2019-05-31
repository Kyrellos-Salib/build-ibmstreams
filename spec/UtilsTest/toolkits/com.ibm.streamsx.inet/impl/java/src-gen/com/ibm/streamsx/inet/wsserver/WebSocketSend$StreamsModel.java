package com.ibm.streamsx.inet.wsserver;
import com.ibm.streams.operator.metrics.Metric.Kind;
import com.ibm.streams.operator.model.InputPortSet.WindowMode;
import com.ibm.streams.operator.model.InputPortSet.WindowPunctuationInputMode;
import com.ibm.streams.operator.model.OutputPortSet.WindowPunctuationOutputMode;

@com.ibm.streams.operator.model.PrimitiveOperator(namespace="com.ibm.streamsx.inet.wsserver", description="Operator transmits tuples recieved on the input port via WebSocket protocol to connected clients.Upon startup, starts WebSocket Server. As tuple arrives on the input port they're converted intoJSON formatted messages and transmitted to all currently connected clients. Clients can connect and disconnect at anytime.")
@com.ibm.streams.operator.model.InputPorts(value={@com.ibm.streams.operator.model.InputPortSet(description="Port that clients connect to and tuples formatted as JSON message are transmitted over.", cardinality=1, optional=false, windowingMode=WindowMode.NonWindowed)})
@com.ibm.streams.operator.model.Libraries(value={"opt/wssupport/Java-WebSocket-1.3.0.jar"})
@com.ibm.streams.operator.model.Icons(location32="icons/WebSocketSend_32.gif", location16="icons/WebSocketSend_16.gif")
@com.ibm.streams.operator.internal.model.ShadowClass("com.ibm.streamsx.inet.wsserver.WebSocketSend")
@javax.annotation.Generated("com.ibm.streams.operator.internal.model.processors.ShadowClassGenerator")
public class WebSocketSend$StreamsModel extends com.ibm.streams.operator.AbstractOperator
 {

@com.ibm.streams.operator.model.Parameter(optional=true, description="Set the batch size.")
@com.ibm.streams.operator.internal.model.MethodParameters({"batchSize"})
public void setBatchSize(int batchSize) {}

@com.ibm.streams.operator.model.CustomMetric(description="Number of messages sent using WebSocket", kind=Kind.COUNTER)
@com.ibm.streams.operator.internal.model.MethodParameters({"nPostRequests"})
public void setnMessagesSent(com.ibm.streams.operator.metrics.Metric nPostRequests) {}

@com.ibm.streams.operator.model.CustomMetric(description="Number of clients currently using WebSocket", kind=Kind.GAUGE)
@com.ibm.streams.operator.internal.model.MethodParameters({"nClientsConnected"})
public void setnClientsConnected(com.ibm.streams.operator.metrics.Metric nClientsConnected) {}

@com.ibm.streams.operator.model.Parameter(name="port", optional=false, description="Port that clients connect to and tuples formatted as JSON message are transmitted over.")
@com.ibm.streams.operator.internal.model.MethodParameters({"portNum"})
public void setPort(int portNum) {}
}