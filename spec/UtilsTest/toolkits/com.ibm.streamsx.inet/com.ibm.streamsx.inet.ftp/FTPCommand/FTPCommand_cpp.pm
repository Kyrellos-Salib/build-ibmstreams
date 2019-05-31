
package FTPCommand_cpp;
use strict; use Cwd 'realpath';  use File::Basename;  use lib dirname(__FILE__);  use SPL::Operator::Instance::OperatorInstance; use SPL::Operator::Instance::Annotation; use SPL::Operator::Instance::Context; use SPL::Operator::Instance::Expression; use SPL::Operator::Instance::ExpressionTree; use SPL::Operator::Instance::ExpressionTreeEvaluator; use SPL::Operator::Instance::ExpressionTreeVisitor; use SPL::Operator::Instance::ExpressionTreeCppGenVisitor; use SPL::Operator::Instance::InputAttribute; use SPL::Operator::Instance::InputPort; use SPL::Operator::Instance::OutputAttribute; use SPL::Operator::Instance::OutputPort; use SPL::Operator::Instance::Parameter; use SPL::Operator::Instance::StateVariable; use SPL::Operator::Instance::TupleValue; use SPL::Operator::Instance::Window; 
sub main::generate($$) {
   my ($xml, $signature) = @_;  
   print "// $$signature\n";
   my $model = SPL::Operator::Instance::OperatorInstance->new($$xml);
   unshift @INC, dirname ($model->getContext()->getOperatorDirectory()) . "/../impl/nl/include";
   $SPL::CodeGenHelper::verboseMode = $model->getContext()->isVerboseModeOn();
   print '/* Copyright (C) 2013-2014, International Business Machines Corporation */', "\n";
   print '/* All Rights Reserved */', "\n";
   print "\n";
   print '/* Additional includes go here */', "\n";
   print '#include <cstring>', "\n";
   print '#include <cstdlib>', "\n";
   print "\n";
   	require InetResource;
   
   	#warn deprecated COF
   	sub warnDeprecateCof {
   		SPL::CodeGen::warnln(InetResource::INET_DEPRECATED_COF(@_), $model->getContext()->getSourceLocation());
   	}
   
   	my $ccContext = $model->getContext()->getOptionalContext("ConsistentRegion");
   	if (defined $ccContext) {
   		SPL::CodeGen::exitln(InetResource::INET_CONSISTENT_CHECK("FTPCommand"));
   	}
   
   	my $hasPasswordStream = $model->getNumberOfInputPorts() == 2;
   	my $hasErrorStream = $model->getNumberOfOutputPorts() == 2;
   	my $mainOutputPort = $model->getOutputPortAt(0);
   	my $errorOutputPort;
   	if ($hasErrorStream) { $errorOutputPort = $model->getOutputPortAt(1); }
   	my $mainInputPort = $model->getInputPortAt(0);
   	
   	my $protocol     = $model->getParameterByName("protocol")->getValueAt(0)->getCppExpression();
   	my $protocolType = $model->getParameterByName("protocol")->getValueAt(0)->getCppType();
   	
   	my $hasCloseConnectionMode = $model->getParameterByName("connectionCloseMode");
   	my $closeConnectionMode;
   	my $closeConnectionModeType;
   	if ($hasCloseConnectionMode) {
   		$closeConnectionMode = $hasCloseConnectionMode->getValueAt(0)->getCppExpression();
   		$closeConnectionModeType = $hasCloseConnectionMode->getValueAt(0)->getCppType();
   	}
   	print "//closeConnectionMode : $closeConnectionMode\n";
   	print "//closeConnectionModeType : $closeConnectionModeType\n";
   	
   	my $host = $model->getParameterByName("host")->getValueAt(0)->getCppExpression();
   	print "//host : $host\n";
   	my $path = $model->getParameterByName("path")->getValueAt(0)->getCppExpression();
   	print "//path : $path\n";
   	
   	my $username = $model->getParameterByName("username")->getValueAt(0)->getCppExpression();
   	my $password = $model->getParameterByName("password");
   	$password = $password->getValueAt(0)->getCppExpression() if ($password);
   	print "//password : $password\n";
   
   	my $command = $model->getParameterByName("command")->getValueAt(0)->getSPLExpression();
   	my $commandCpp = $model->getParameterByName("command")->getValueAt(0)->getCppExpression();
   	print "//command   =$command\n";
   	print "//commandCpp=$commandCpp\n";
   	
   	my $filename = $model->getParameterByName("filename");
   	$filename = $filename->getValueAt(0)->getCppExpression() if ($filename);
   	my $filenameTo = $model->getParameterByName("filenameTo");
   	$filenameTo = $filenameTo->getValueAt(0)->getCppExpression() if ($filenameTo);
   
   	my $connectionTimeout = $model->getParameterByName("connectionTimeout");
   	$connectionTimeout = $connectionTimeout->getValueAt(0)->getCppExpression() if ($connectionTimeout);
   	print "//connectionTimeout = $connectionTimeout\n";
   
   	my $transferTimeout = $model->getParameterByName("transferTimeout");
   	$transferTimeout = $transferTimeout->getValueAt(0)->getCppExpression() if ($transferTimeout);
   	print "//transferTimeout = $transferTimeout\n";
   
   	my $curlVerbose = $model->getParameterByName("curlVerbose");
   	$curlVerbose = $curlVerbose ? $curlVerbose->getValueAt(0)->getCppExpression() : "false";
   	print "//curlVerbose $curlVerbose\n";
   	
   	my $sendStatisticsOnError = $model->getParameterByName("sendStatisticsOnError");
   	$sendStatisticsOnError = $sendStatisticsOnError ? $sendStatisticsOnError->getValueAt(0)->getSPLExpression : "true";
   	print "//sendStatisticsOnError=$sendStatisticsOnError\n";
   
   	# scan output functions verify operator model out port 1
   	my $hasNonDefaultErrorOutputPortAssignement = 0;
   	if ($hasErrorStream) {
   			for (my $i = 0; $i < $errorOutputPort->getNumberOfAttributes(); $i++) {
   				my $attr = $errorOutputPort->getAttributeAt($i);
   				if ($attr->hasAssignmentWithOutputFunction()) {
   					my $of = $attr->getAssignmentOutputFunctionName();
   					if (($of eq "Error") || ($of eq "ErrorCode")) {
   						$hasNonDefaultErrorOutputPortAssignement = 1;
   					} elsif ($of eq "ErrorText") {
   						$hasNonDefaultErrorOutputPortAssignement = 1;
   					} elsif ($of eq "Url") {
   						$hasNonDefaultErrorOutputPortAssignement = 1;
   					} elsif (($of eq "NoTransfers") || ($of eq "CommandCount")) {
   						$hasNonDefaultErrorOutputPortAssignement = 1;
   					} elsif (($of eq "NoTransferFailures") || ($of eq "CommandFailureCount")) {
   						$hasNonDefaultErrorOutputPortAssignement = 1;
   					}
   				}
   			}
   	}
   
   	# scan output functions verify operator model
   	if (! $hasNonDefaultErrorOutputPortAssignement) {
   		if ($hasErrorStream) {
   			$errorOutputPort = $model->getOutputPortAt(1);
   			if (1 != $errorOutputPort->getNumberOfAttributes()) {
   				SPL::CodeGen::exitln(InetResource::INET_FTP_READER_OUTPUT_PARAM_CHECK_1(), $errorOutputPort->getSourceLocation());
   			}
   			if (!SPL::CodeGen::Type::isRString($errorOutputPort->getAttributeAt(0)->getSPLType())) {
   				SPL::CodeGen::exitln(InetResource::INET_FTP_READER_OUTPUT_PARAM_CHECK_1(), $errorOutputPort->getSourceLocation());
   			}
   		}
   	}
   print "\n";
   print "\n";
   SPL::CodeGen::implementationPrologue($model);
   print "\n";
   print "\n";
   print 'using namespace com::ibm::streamsx::inet::ftp;', "\n";
   print '// Constructor', "\n";
   print 'MY_OPERATOR_SCOPE::MY_OPERATOR::MY_OPERATOR() :', "\n";
   print '	mutex(),', "\n";
   print '	shutdown(false)', "\n";
   print '{', "\n";
   print '	FTPWrapper::TransmissionProtocolLiteral tpl = static_cast<FTPWrapper::TransmissionProtocolLiteral>(';
   print $protocol;
   print '.getIndex());', "\n";
   print '	FTPWrapper::CloseConnectionMode cm = FTPWrapper::never;', "\n";
   	if ($hasCloseConnectionMode) { 
   print "\n";
   print '		cm = static_cast<FTPWrapper::CloseConnectionMode>(';
   print $closeConnectionMode;
   print '.getIndex());', "\n";
   	} 
   print "\n";
   print '	SPLAPPTRC(L_INFO, "Work with protocol:" << FTPWrapper::toString(tpl) << " closeConnectionMode=" << FTPWrapper::toString(cm), debugAspect);', "\n";
   print "\n";
   print '	wrapper = new FTPCommandWrapper(cm, tpl, ';
   print $curlVerbose;
   print ', FTPWrapper::create, debugAspect);', "\n";
   print '}', "\n";
   print "\n";
   print '// Destructor', "\n";
   print 'MY_OPERATOR_SCOPE::MY_OPERATOR::~MY_OPERATOR() {', "\n";
   print '	delete wrapper;', "\n";
   print '}', "\n";
   print "\n";
   print '// Notify pending shutdown', "\n";
   print 'void MY_OPERATOR_SCOPE::MY_OPERATOR::prepareToShutdown() {', "\n";
   print '	// This is an asynchronous call', "\n";
   print '	shutdown = true;', "\n";
   print '	wrapper->prepareToShutdown();', "\n";
   print '}', "\n";
   print "\n";
   print '// Tuple processing for non mutating ports', "\n";
   print 'void MY_OPERATOR_SCOPE::MY_OPERATOR::process(Tuple const & tuple, uint32_t port) {', "\n";
   print '	SPLAPPTRC(L_TRACE, "process(" << tuple << ", " << port << ")", debugAspect);', "\n";
   print "\n";
   print '	AutoPortMutex apm(mutex, *this);', "\n";
   print "\n";
   print '	switch (port) {', "\n";
   print '	case 0 : {', "\n";
   print '		IPort0Type const & iport$0 = static_cast<IPort0Type const &> (tuple);', "\n";
   print "\n";
   		unless ($hasPasswordStream) { 
   print "\n";
   print '			//set credentials', "\n";
   print '			wrapper->setUsername(';
   print $username;
   print ');', "\n";
   			if ($password) { 
   print "\n";
   print '				wrapper->setPassword(';
   print $password;
   print ');', "\n";
   			} 
   print "\n";
   		} 
   print "\n";
   print "\n";
   		if ($connectionTimeout) { 
   print "\n";
   print '			wrapper->setConnectionTimeout(';
   print $connectionTimeout;
   print ');', "\n";
   		} 
   print "\n";
   		if ($transferTimeout) { 
   print "\n";
   print '			wrapper->setTransferTimeout(';
   print $transferTimeout;
   print ');', "\n";
   		} 
   print "\n";
   print "\n";
   print '		wrapper->clearCommand();', "\n";
   print '		wrapper->setHost(';
   print $host;
   print ');', "\n";
   print '		wrapper->setPath(';
   print $path;
   print ');', "\n";
   print '		wrapper->setCommand(';
   print $commandCpp;
   print ');', "\n";
   		if ($filename) {
   print "\n";
   print '			wrapper->setArg1(';
   print $filename;
   print ');', "\n";
   		}
   print "\n";
   		if ($filenameTo) { 
   print "\n";
   print '			wrapper->setArg2(';
   print $filenameTo;
   print ');', "\n";
   		} 
   print "\n";
   print "\n";
   print '		//perform operation', "\n";
   print '		bool sendStatistics = false;', "\n";
   print '		bool success;', "\n";
   print '		if (wrapper->perform()) {', "\n";
   print '			success = true;', "\n";
   print '			SPLAPPTRC(L_DEBUG, "operation well performed", debugAspect);', "\n";
   print '			sendStatistics = true;', "\n";
   print '		} else {', "\n";
   print '			success = false;', "\n";
   			if ($sendStatisticsOnError eq "true") {
   print "\n";
   print '				sendStatistics = true;', "\n";
   			} 
   print "\n";
   print '			sendError(wrapper->getError(), iport$0);', "\n";
   print '		}', "\n";
   print "\n";
   print '		//send the output tuple', "\n";
   print '		if (sendStatistics) {', "\n";
   			# generate the initializer for the tuple
   			my $init = "";
   			my $numAttrs = $mainOutputPort->getNumberOfAttributes();
   			for (my $i = 0; $i < $numAttrs; $i++) {
   				my $attr = $mainOutputPort->getAttributeAt($i);
   				my $aName = $attr->getName();
   				if ($attr->hasAssignmentWithOutputFunction()) {
   					my $of = $attr->getAssignmentOutputFunctionName();
   					if ($of eq "Result") {
   						$init .= "SPL::rstring(wrapper->getResult())";
   					} elsif ($of eq "Success") {
   						$init .= "SPL::boolean(success)";
   					} elsif ($of eq "Url") {
   						$init .= "SPL::rstring(wrapper->getUrl())";
   					} elsif ($of eq "NoCommands") {
   						warnDeprecateCof("NoCommands()");
   						$init .= "SPL::uint64(wrapper->getNoTransfers())";
   					} elsif ($of eq "CommandCount") {
   						$init .= "SPL::uint64(wrapper->getNoTransfers())";
   					} elsif ($of eq "NoFailures") {
   						warnDeprecateCof("NoFailures()");
   						$init .= "SPL::uint64(wrapper->getNoTransferFailures())";
   					} elsif ($of eq "CommandFailureCount") {
   						$init .= "SPL::uint64(wrapper->getNoTransferFailures())";
   					} elsif ($of eq "AsIs") {
   						$init .= SPL::CodeGenHelper::ensureValue ($attr->getSPLType(), $attr->getAssignmentValue()->getCppExpression());
   					}
   				} else {
   					$init .= SPL::CodeGenHelper::ensureValue ($attr->getSPLType(), $attr->getAssignmentValue()->getCppExpression());
   				}
   				$init .= ",\n" if $i < $numAttrs-1;
   			}
   print "\n";
   print '			//submit output', "\n";
   print '			OPort0Type otuple = OPort0Type(';
   print $init;
   print ');', "\n";
   print '			/* this does not compile: OPort0Type otuple(';
   print $init;
   print '); */', "\n";
   print '			submit(otuple, 0);', "\n";
   print '		}', "\n";
   print '		break;', "\n";
   print '	}', "\n";
   	if ($hasPasswordStream) { 
   print "\n";
   print '		case 1 : {', "\n";
   print '			IPort1Type const & iport$1 = static_cast<IPort1Type const &> (tuple);', "\n";
   print '			//set credentials', "\n";
   print '			wrapper->setUsername(';
   print $username;
   print ');', "\n";
   			if ($password) {
   print "\n";
   print '				wrapper->setPassword(';
   print $password;
   print ');', "\n";
   			} 
   print "\n";
   print '		};', "\n";
   	} 
   print "\n";
   print '	}', "\n";
   print '}', "\n";
   print "\n";
   print '// Punctuation processing', "\n";
   print 'void MY_OPERATOR_SCOPE::MY_OPERATOR::process(Punctuation const & punctuation, uint32_t port) {', "\n";
   print '	AutoPortMutex apm(mutex, *this);', "\n";
   print '	if(Punctuation::WindowMarker == punctuation) {', "\n";
   print '		SPLAPPTRC(L_DEBUG, "got a punct WindowMarker from port " << port, debugAspect);', "\n";
   print '		if (0 == port) {', "\n";
   print '			wrapper->onPunct();', "\n";
   print '			submit(SPL::Punctuation(SPL::Punctuation::WindowMarker), 0);', "\n";
   print '		}', "\n";
   print '	} else {', "\n";
   print '		SPLAPPTRC(L_DEBUG, "got a punct FinalMarker from port " << port, debugAspect);', "\n";
   print '	}', "\n";
   print '}', "\n";
   print "\n";
   print 'void MY_OPERATOR_SCOPE::MY_OPERATOR::sendError(SPL::rstring const & reason, IPort0Type const & iport$0) {', "\n";
   print '	SPL::rstring err2 = reason + " url:" + wrapper->getUrl() + " command:" + wrapper->getCommand() + " " + wrapper->getArg1() + " " + wrapper->getArg2();', "\n";
   print '	SPLAPPTRC(L_ERROR, err2, debugAspect);', "\n";
    if ($hasErrorStream) { 
   print "\n";
   print '	';
   	# generate the initializer for the tuple
   		my $init = "";
   		if ($hasNonDefaultErrorOutputPortAssignement) {
   			my $numAttrs = $errorOutputPort->getNumberOfAttributes();
   			for (my $i = 0; $i < $numAttrs; $i++) {
   				my $attr = $errorOutputPort->getAttributeAt($i);
   				my $aName = $attr->getName();
   				if ($attr->hasAssignmentWithOutputFunction()) {
   					my $of = $attr->getAssignmentOutputFunctionName();
   					if ($of eq "Error") {
   						warnDeprecateCof("Error()");
   						$init .= "SPL::int32(wrapper->getResultCode())";
   					} elsif ($of eq "ErrorCode") {
   						$init .= "SPL::int32(wrapper->getResultCode())";
   					} elsif ($of eq "ErrorText") {
   						$init .= "SPL::rstring(err2)";
   					} elsif ($of eq "Url") {
   						$init .= "SPL::rstring(wrapper->getUrl())";
   					} elsif ($of eq "NoTransfers") {
   						warnDeprecateCof("NoTransfers()");
   						$init .= "SPL::uint32(wrapper->getNoTransfers())";
   					} elsif ($of eq "CommandCount") {
   						$init .= "SPL::uint32(wrapper->getNoTransfers())";
   					} elsif ($of eq "NoTransferFailures") {
   						warnDeprecateCof("NoTransferFailures()");
   						$init .= "SPL::uint32(wrapper->getNoTransferFailures())";
   					} elsif ($of eq "CommandFailureCount") {
   						$init .= "SPL::uint32(wrapper->getNoTransferFailures())";
   					} elsif ($of eq "AsIs") {
   						$init .= SPL::CodeGenHelper::ensureValue ($attr->getSPLType(), $attr->getAssignmentValue()->getCppExpression());
   					}
   				} else {
   					$init .= $attr->getCppType;
   					$init .= "()";
   				}
   				$init .= ",\n" if $i < $numAttrs-1;
   			}
   		} else {
   			$init .= "SPL::rstring(err2)";
   		}
   	
   print "\n";
   print '	OPort1Type otuple = OPort1Type(';
   print $init;
   print ');', "\n";
   print '	submit(otuple, 1);', "\n";
    } 
   print "\n";
   print '}', "\n";
   print "\n";
   print 'SPL::rstring MY_OPERATOR_SCOPE::MY_OPERATOR::debugAspect("FTPCommand");', "\n";
   print "\n";
   SPL::CodeGen::implementationEpilogue($model);
   print "\n";
   print "\n";
   CORE::exit $SPL::CodeGen::USER_ERROR if ($SPL::CodeGen::sawError);
}
1;
