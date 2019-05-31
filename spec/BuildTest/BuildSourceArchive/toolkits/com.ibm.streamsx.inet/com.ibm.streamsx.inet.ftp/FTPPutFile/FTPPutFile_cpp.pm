
package FTPPutFile_cpp;
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
   		SPL::CodeGen::exitln(InetResource::INET_CONSISTENT_CHECK("FTPPutFile"));
   	}
   
   	my $hasPasswordStream = $model->getNumberOfInputPorts() == 2;
   	my $hasErrorStream = $model->getNumberOfOutputPorts() == 2;
   	
   	my $protocol     = $model->getParameterByName("protocol")->getValueAt(0)->getCppExpression();
   	my $protocolType = $model->getParameterByName("protocol")->getValueAt(0)->getCppType();
   	my $protocolSPLType = $model->getParameterByName("protocol")->getValueAt(0)->getSPLType();
   	my $protocolEm = $model->getParameterByName("protocol")->getValueAt(0)->getParameterExpressionMode();
   	print "//$protocol\n//$protocolType\n//$protocolSPLType\n//$protocolEm\n";
   	
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
   	
   	my $filename = $model->getParameterByName("filename");
   	$filename = $filename->getValueAt(0)->getCppExpression() if $filename;
   	
   	my $renameTo = $model->getParameterByName("renameTo");
   	$renameTo = $renameTo->getValueAt(0)->getCppExpression() if $renameTo;
   
   	my $localFilename = $model->getParameterByName("localFilename")->getValueAt(0)->getCppExpression();
   
   	my $username = $model->getParameterByName("username")->getValueAt(0)->getCppExpression();
   
   	my $password = $model->getParameterByName("password");
   	$password = $password->getValueAt(0)->getCppExpression() if ($password);
   	print "//password : $password\n";
   
   	my $connectionTimeout = $model->getParameterByName("connectionTimeout");
   	$connectionTimeout = $connectionTimeout->getValueAt(0)->getCppExpression() if ($connectionTimeout);
   	print "//connectionTimeout = $connectionTimeout\n";
   
   	my $transferTimeout = $model->getParameterByName("transferTimeout");
   	$transferTimeout = $transferTimeout->getValueAt(0)->getCppExpression() if ($transferTimeout);
   	print "//transferTimeout = $transferTimeout\n";
   
   	my $curlVerbose = $model->getParameterByName("curlVerbose");
   	$curlVerbose = $curlVerbose ? $curlVerbose->getValueAt(0)->getCppExpression() : "false";
   	print "//curlVerbose $curlVerbose\n";
   
   	my $useEPSV = $model->getParameterByName("useEPSV");
   	$useEPSV = $useEPSV ? $useEPSV->getValueAt(0)->getCppExpression() : "true";
   	print "//useEPSV $useEPSV\n";
   	my $useEPRT = $model->getParameterByName("useEPRT");
   	$useEPRT= $useEPRT ? $useEPRT->getValueAt(0)->getCppExpression() : "true";
   	print "//useEPRT $useEPRT\n";
   	my $usePRET;
   	# = $model->getParameterByName("usePRET");
   	#if ($usePRET) { $usePRET = $usePRET->getValueAt(0)->getCppExpression(); }
   	#print "//usePRET $usePRET\n";
   	my $usePORT = $model->getParameterByName("usePORT");
   	if ($usePORT) { $usePORT = $usePORT->getValueAt(0)->getCppExpression(); } else { undef $usePORT; }
   	print "//usePORT $usePORT\n";
   	my $skipPASVIp = $model->getParameterByName("skipPASVIp");
   	$skipPASVIp = $skipPASVIp ? $skipPASVIp->getValueAt(0)->getCppExpression() : "false";
   	print "//skipPASVIp $skipPASVIp\n";
   
   	my $sendStatisticsOnError = $model->getParameterByName("sendStatisticsOnError");
   	$sendStatisticsOnError = $sendStatisticsOnError ? $sendStatisticsOnError->getValueAt(0)->getSPLExpression : "false";
   	print "//sendStatisticsOnError=$sendStatisticsOnError\n";
   	
   	my $mainOutputPort = $model->getOutputPortAt(0);
   	my $errorOutputPort;
   	if ($hasErrorStream) {
   		$errorOutputPort = $model->getOutputPortAt(1);
   	}
   	
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
   				} elsif (($of eq "NoTransfers") || ($of eq "TransferCount")) {
   					$hasNonDefaultErrorOutputPortAssignement = 1;
   				} elsif (($of eq "NoTransferFailures") || ($of eq "TransferFailureCount")) {
   					$hasNonDefaultErrorOutputPortAssignement = 1;
   				} elsif (($of eq "NoBytesTransferred") || ($of eq "BytesTransferred")) {
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
   print '	writer = new FTPPutFileWrapper(cm, tpl, ';
   print $curlVerbose;
   print ', FTPWrapper::create, debugAspect, ';
   print $useEPSV;
   print ', ';
   print $useEPRT;
   print ', ';
   print $skipPASVIp;
   print ');', "\n";
   print '}', "\n";
   print "\n";
   print '// Destructor', "\n";
   print 'MY_OPERATOR_SCOPE::MY_OPERATOR::~MY_OPERATOR() {', "\n";
   print '	delete writer;', "\n";
   print '}', "\n";
   print "\n";
   print '// Notify pending shutdown', "\n";
   print 'void MY_OPERATOR_SCOPE::MY_OPERATOR::prepareToShutdown() {', "\n";
   print '	// This is an asynchronous call', "\n";
   print '	shutdown = true;', "\n";
   print '	writer->prepareToShutdown();', "\n";
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
   print '			writer->setUsername(';
   print $username;
   print ');', "\n";
   			if ($password) { 
   print "\n";
   print '				writer->setPassword(';
   print $password;
   print ');', "\n";
   			} 
   print "\n";
   		} 
   print "\n";
   print '		const rstring localFilename(';
   print $localFilename;
   print ');', "\n";
   print '		', "\n";
   print '		if (localFilename[0] == \'/\') {', "\n";
   print '		   writer->setLocalFilename(localFilename);', "\n";
   print '		}', "\n";
   print '		else {', "\n";
   print '		     writer->setLocalFilename(Functions::Utility::dataDirectory()+"/"+';
   print $localFilename;
   print ');', "\n";
   print '		}', "\n";
   print '		writer->setHost(';
   print $host;
   print ');', "\n";
   print '		writer->setPath(';
   print $path;
   print ');', "\n";
   		if ($filename) {
   print "\n";
   print '			writer->setFilename(';
   print $filename;
   print ');', "\n";
   		}
   print "\n";
   if	($usePORT) {
   print "\n";
   print '			writer->setUsePORT(';
   print $usePORT;
   print ');', "\n";
   		}
   print "\n";
   		if ($connectionTimeout) { 
   print "\n";
   print '			writer->setConnectionTimeout(';
   print $connectionTimeout;
   print ');', "\n";
   		} 
   print "\n";
   		if ($transferTimeout) { 
   print "\n";
   print '			writer->setTransferTimeout(';
   print $transferTimeout;
   print ');', "\n";
   		} 
   print "\n";
   if	($renameTo) {
   print "\n";
   print '			writer->setRenameTo(';
   print $renameTo;
   print ');', "\n";
   		}
   print "\n";
   print "\n";
   print '		//perform operation', "\n";
   print '		if (writer->perform()) {', "\n";
   print '			SPLAPPTRC(L_DEBUG, "operation well performed", debugAspect);', "\n";
   print '			generateOutTuple(true, iport$0);', "\n";
   print '		} else {', "\n";
   			if ($sendStatisticsOnError eq "true") {
   print "\n";
   print '				generateOutTuple(false, iport$0);', "\n";
   			}
   print "\n";
   print '			sendError(writer->getError(), iport$0);', "\n";
   print '		}', "\n";
   print '		break;', "\n";
   print '	}', "\n";
   	if ($hasPasswordStream) { 
   print "\n";
   print '		case 1 : {', "\n";
   print '			IPort1Type const & iport$1 = static_cast<IPort1Type const &> (tuple);', "\n";
   print '			//set credentials', "\n";
   print '			writer->setUsername(';
   print $username;
   print ');', "\n";
   			if ($password) {
   print "\n";
   print '				writer->setPassword(';
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
   print '			writer->onPunct();', "\n";
   print '			submit(SPL::Punctuation(SPL::Punctuation::WindowMarker), 0);', "\n";
   print '		}', "\n";
   print '	} else { //final marker', "\n";
   print '		SPLAPPTRC(L_DEBUG, "got a punct FinalMarker from port " << port, debugAspect);', "\n";
   print '	}', "\n";
   print '}', "\n";
   print "\n";
   print 'void MY_OPERATOR_SCOPE::MY_OPERATOR::generateOutTuple(bool success, IPort0Type const & iport$0) {', "\n";
   	# generate the initializer for the tuple
   	my $init = "";
   	my $numAttrs = $mainOutputPort->getNumberOfAttributes();
   	for (my $i = 0; $i < $numAttrs; $i++) {
   		my $attr = $mainOutputPort->getAttributeAt($i);
   		my $aName = $attr->getName();
   		if ($attr->hasAssignmentWithOutputFunction()) {
   			my $of = $attr->getAssignmentOutputFunctionName();
   			if ($of eq "Success") {
   				$init .= "SPL::boolean(success)";
   			} elsif ($of eq "Url") {
   				$init .= "SPL::rstring(writer->getUrl())";
   			} elsif ($of eq "FileSize") {
   				$init .= "SPL::uint64(writer->getFileSize())";
   			} elsif ($of eq "NoTransfers") {
   				warnDeprecateCof("NoTransfers()");
   				$init .= "SPL::uint32(writer->getNoTransfers())";
   			} elsif ($of eq "TransferCount") {
   				$init .= "SPL::uint32(writer->getNoTransfers())";
   			} elsif ($of eq "NoTransferFailures") {
   				warnDeprecateCof("NoTransferFailures()");
   				$init .= "SPL::uint32(writer->getNoTransferFailures())";
   			} elsif ($of eq "TransferFailureCount") {
   				$init .= "SPL::uint32(writer->getNoTransferFailures())";
   			} elsif ($of eq "NoBytesTransferred") {
   				warnDeprecateCof("NoBytesTransferred()");
   				$init .= "SPL::uint32(writer->getNoBytesTransferred())";
   			} elsif ($of eq "BytesTransferred") {
   				$init .= "SPL::uint32(writer->getNoBytesTransferred())";
   			} elsif ($of eq "TransferSpeed") {
   				$init .= "SPL::float64(writer->getTransferSpeed())";
   			} elsif ($of eq "AsIs") {
   				$init .= SPL::CodeGenHelper::ensureValue ($attr->getSPLType(), $attr->getAssignmentValue()->getCppExpression());
   			}
   		} else {
   			$init .= $attr->getCppType;
   			$init .= "()";
   		}
   		$init .= ",\n" if $i < $numAttrs-1;
   	}
   print "\n";
   print '	OPort0Type otuple = OPort0Type(';
   print $init;
   print ');', "\n";
   print '	SPLAPPTRC(L_TRACE, "send tuple ", debugAspect);', "\n";
   print '	submit(otuple, 0);', "\n";
   print '}', "\n";
   print "\n";
   print 'void MY_OPERATOR_SCOPE::MY_OPERATOR::sendError(SPL::rstring const & reason, IPort0Type const & iport$0) {', "\n";
   print '	SPL::rstring err2 = reason + " url:" + writer->getUrl() + " localFile:" + writer->getLocalFilename();', "\n";
   print '	SPLAPPTRC(L_ERROR, err2, debugAspect);', "\n";
    if ($hasErrorStream) { 
   print "\n";
   print '	';
   	# generate the initializer for the tuple
   		my $init = "";
   		my $numAttrs = $errorOutputPort->getNumberOfAttributes();
   		for (my $i = 0; $i < $numAttrs; $i++) {
   			my $attr = $errorOutputPort->getAttributeAt($i);
   			my $aName = $attr->getName();
   			if ($attr->hasAssignmentWithOutputFunction()) {
   				my $of = $attr->getAssignmentOutputFunctionName();
   				if ($of eq "Error") {
   					warnDeprecateCof("Error()");
   					$init .= "SPL::uint32(writer->getResultCode())";
   				} elsif ($of eq "ErrorCode") {
   					$init .= "SPL::uint32(writer->getResultCode())";
   				} elsif ($of eq "ErrorText") {
   					$init .= "SPL::rstring(err2)";
   				} elsif ($of eq "Url") {
   					$init .= "SPL::rstring(writer->getUrl())";
   				} elsif ($of eq "NoTransfers") {
   					warnDeprecateCof("NoTransfers()");
   					$init .= "SPL::uint32(writer->getNoTransfers())";
   				} elsif ($of eq "TransferCount") {
   					$init .= "SPL::uint32(writer->getNoTransfers())";
   				} elsif ($of eq "NoTransferFailures") {
   					warnDeprecateCof("NoTransferFailures()");
   					$init .= "SPL::uint32(writer->getNoTransferFailures())";
   				} elsif ($of eq "TransferFailureCount") {
   					$init .= "SPL::uint32(writer->getNoTransferFailures())";
   				} elsif ($of eq "NoBytesTransferred") {
   					warnDeprecateCof("NoBytesTransferred()");
   					$init .= "SPL::uint32(writer->getNoBytesTransferred())";
   				} elsif ($of eq "BytesTransferred") {
   					$init .= "SPL::uint32(writer->getNoBytesTransferred())";
   				} elsif ($of eq "AsIs") {
   					$init .= SPL::CodeGenHelper::ensureValue ($attr->getSPLType(), $attr->getAssignmentValue()->getCppExpression());
   				}
   			} else {
   				$init .= $attr->getCppType;
   				$init .= "()";
   			}
   			$init .= ",\n" if $i < $numAttrs-1;
   		}
   	
   print "\n";
   print '	OPort1Type ot = OPort1Type(';
   print $init;
   print ');', "\n";
   print '	submit(ot, (uint32_t)1);', "\n";
    } 
   print "\n";
   print '}', "\n";
   print "\n";
   print 'SPL::rstring MY_OPERATOR_SCOPE::MY_OPERATOR::debugAspect("FTPPutFile");', "\n";
   print "\n";
   SPL::CodeGen::implementationEpilogue($model);
   print "\n";
   print "\n";
   CORE::exit $SPL::CodeGen::USER_ERROR if ($SPL::CodeGen::sawError);
}
1;
