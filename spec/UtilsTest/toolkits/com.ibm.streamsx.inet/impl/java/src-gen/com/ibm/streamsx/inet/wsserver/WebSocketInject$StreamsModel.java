package com.ibm.streamsx.inet.wsserver;
import com.ibm.streams.operator.metrics.Metric.Kind;
import com.ibm.streams.operator.model.InputPortSet.WindowMode;
import com.ibm.streams.operator.model.InputPortSet.WindowPunctuationInputMode;
import com.ibm.streams.operator.model.OutputPortSet.WindowPunctuationOutputMode;

@com.ibm.streams.operator.model.PrimitiveOperator(namespace="com.ibm.streamsx.inet.wsserver", description=" Operator recieves messages from WebSocket clients and generates a tuple which is sent to streams.  Each received message is output as tuple. The data received is dependent upon the input ports schema.")
@com.ibm.streams.operator.model.OutputPorts(value={@com.ibm.streams.operator.model.OutputPortSet(description="First attribute will have the message received via the WebSocket, of type rstring. Second attribute (if provided) will have the senders unique id, or type rstring.Subsequent attribute(s) are allowed and will not be poplulated.", cardinality=1, optional=false, windowPunctuationOutputMode=WindowPunctuationOutputMode.Free)})
@com.ibm.streams.operator.model.Libraries(value={"opt/wssupport/Java-WebSocket-1.3.0.jar"})
@com.ibm.streams.operator.model.Icons(location32="icons/WebSocketInject_32.gif", location16="icons/WebSocketInject_16.gif")
@com.ibm.streams.operator.internal.model.ShadowClass("com.ibm.streamsx.inet.wsserver.WebSocketInject")
@javax.annotation.Generated("com.ibm.streams.operator.internal.model.processors.ShadowClassGenerator")
public class WebSocketInject$StreamsModel extends com.ibm.streams.operator.AbstractOperator
 {

@com.ibm.streams.operator.model.Parameter(optional=true, description="Delay in seconds before the operator starts producing tuples.")
@com.ibm.streams.operator.internal.model.MethodParameters({"delaySeconds"})
public void setInitDelay(long delaySeconds) {}

@com.ibm.streams.operator.model.CustomMetric(description="Number of messages received via WebSocket", kind=Kind.COUNTER)
@com.ibm.streams.operator.internal.model.MethodParameters({"nMessagesReceived"})
public void setnMessagesReceived(com.ibm.streams.operator.metrics.Metric nMessagesReceived) {}

@com.ibm.streams.operator.model.CustomMetric(description="Number of clients currently connected to WebSocket port.", kind=Kind.GAUGE)
@com.ibm.streams.operator.internal.model.MethodParameters({"nClientsConnected"})
public void setnClientsConnected(com.ibm.streams.operator.metrics.Metric nClientsConnected) {}

@com.ibm.streams.operator.model.Parameter(name="messageAttribute", optional=true, description="Input port's attribute that the data received will be stored to. If the port has more than one attribute this parameter is required. ")
@com.ibm.streams.operator.internal.model.MethodParameters({"messageAttrName"})
public void setMessageAttrName(java.lang.String messageAttrName) {}

@com.ibm.streams.operator.model.Parameter(name="senderIdAttribute", optional=true, description="Input port attribute that will we loaded with the message sender's identifier, this identifier is consistent during the lifetime of the sender's session.")
@com.ibm.streams.operator.internal.model.MethodParameters({"senderIdAttrName"})
public void setSenderIdAttrName(java.lang.String senderIdAttrName) {}

@com.ibm.streams.operator.model.Parameter(name="ackCount", optional=true, description="The operator sends out an ack message to all currently connected clients.  An ack message is sent when the (totaslNumberOfMessagesRecieved % ackCount) == 0, The ack message is a in JSON format \\{ status:'COUNT', text:<totalNumberOfMessagesReceived>\\}. Default value is 0, no ack messages will be sent.")
@com.ibm.streams.operator.internal.model.MethodParameters({"ackCount"})
public void setAckCount(int ackCount) {}

@com.ibm.streams.operator.model.Parameter(name="port", optional=false, description="WebSocket network port that messages arrive on. The WebSocket client(s) use this port to transmit on.")
@com.ibm.streams.operator.internal.model.MethodParameters({"portNum"})
public void setPort(int portNum) {}
}