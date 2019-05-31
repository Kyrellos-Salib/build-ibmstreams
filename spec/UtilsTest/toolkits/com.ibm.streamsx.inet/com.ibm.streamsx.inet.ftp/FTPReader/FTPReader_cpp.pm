
package FTPReader_cpp;
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
   		SPL::CodeGen::exitln(InetResource::INET_CONSISTENT_CHECK("FTPReader"));
   	}
   
   	my $hasPasswordStream = $model->getNumberOfInputPorts() == 2;
   	my $hasErrorStream = $model->getNumberOfOutputPorts() == 2;
   	my $mainOutputPort = $model->getOutputPortAt(0);
   	my $errorOutputPort;
   	if ($hasErrorStream) { $errorOutputPort = $model->getOutputPortAt(1); }
   	my $mainInputPort = $model->getInputPortAt(0);
   	
   	my $protocol     = $model->getParameterByName("protocol")->getValueAt(0)->getCppExpression();
   	my $protocolType = $model->getParameterByName("protocol")->getValueAt(0)->getCppType();
   	my $protocolSPLType = $model->getParameterByName("protocol")->getValueAt(0)->getSPLType();
   	my $protocolEm = $model->getParameterByName("protocol")->getValueAt(0)->getParameterExpressionMode();
   	print "//$protocol\n//$protocolType\n//$protocolSPLType\n//$protocolEm\n";
   
   	my $isDirReader = $model->getParameterByName("isDirReader");
   	$isDirReader = $isDirReader->getValueAt(0)->getSPLExpression() if $isDirReader;
   	if ($isDirReader) {
   		if ($isDirReader ne "true") {
   			undef $isDirReader;
   		}
   	}
   	print "//isDirReader : $isDirReader\n";
   	
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
   
   	# scan output functions to get requested information
   	my $needBinaryData;
   	my $needLine;
   	my $needFileName;
   	my $needFileSize;
   	my $needFileDate;
   	my $needFileUser;
   	my $needFileGroup;
   	my $needFileInfo;
   	my $needIsFile;
   	for (my $i = 0; $i < $mainOutputPort->getNumberOfAttributes(); $i++) {
   		my $attr = $mainOutputPort->getAttributeAt($i);
   		if ($attr->hasAssignmentWithOutputFunction()) {
   			my $of = $attr->getAssignmentOutputFunctionName();
   			if ($of eq "Binary") {
   				$needBinaryData = "1";
   			} elsif ($of eq "Line") {
   				$needLine = "1";
   			} elsif ($of eq "FileName") {
   				$needFileName = "1"; $needLine = "1";
   			} elsif ($of eq "FileSize") {
   				$needFileSize = "1"; $needLine = "1";
   			} elsif ($of eq "FileDate") {
   				$needFileDate = "1"; $needLine = "1";
   			} elsif ($of eq "FileUser") {
   				$needFileUser = "1"; $needLine = "1";
   			} elsif ($of eq "FileGroup") {
   				$needFileGroup = "1"; $needLine = "1";
   			} elsif ($of eq "FileInfo") {
   				$needFileInfo = "1"; $needLine = "1";
   			} elsif ($of eq "IsFile") {
   				$needIsFile = "1"; $needLine = "1";
   			}
   		}
   	}
   	SPL::CodeGen::exitln(InetResource::INET_FTP_READER_PARAM_CHECK_1(), $mainOutputPort->getSourceLocation()) if ($isDirReader && $needBinaryData);
   	SPL::CodeGen::exitln(InetResource::INET_FTP_READER_PARAM_CHECK_2(), $mainOutputPort->getSourceLocation()) if ($needBinaryData && $needLine);
   	SPL::CodeGen::exitln(InetResource::INET_FTP_READER_PARAM_CHECK_3(), $mainOutputPort->getSourceLocation()) if (! $isDirReader && ($needFileName || $needFileSize || $needFileDate || $needFileUser || $needFileGroup || $needFileInfo));
   
   	# scan output functions
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
   
   	#verify operator model for error port in default case
   	if (! $hasNonDefaultErrorOutputPortAssignement) {
   		if ($hasErrorStream) {
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
   print '	sequence(0),', "\n";
   print '	data(),', "\n";
   print '	mutex(),', "\n";
   print '	shutdown(false),', "\n";
   print '	inTuple0(NULL)', "\n";
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
   print '	reader = new FTPReaderWrapper(cm, tpl, ';
   print $curlVerbose;
   print ', FTPWrapper::none, debugAspect, ';
   print $useEPSV;
   print ', ';
   print $useEPRT;
   print ', ';
   print $skipPASVIp;
   print ', this, callback);', "\n";
   print '}', "\n";
   print "\n";
   print '// Destructor', "\n";
   print 'MY_OPERATOR_SCOPE::MY_OPERATOR::~MY_OPERATOR() {', "\n";
   print '	delete reader;', "\n";
   print '}', "\n";
   print "\n";
   print '// Notify pending shutdown', "\n";
   print 'void MY_OPERATOR_SCOPE::MY_OPERATOR::prepareToShutdown() {', "\n";
   print '	// This is an asynchronous call', "\n";
   print '	shutdown = true;', "\n";
   print '	reader->prepareToShutdown();', "\n";
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
   print '			reader->setUsername(';
   print $username;
   print ');', "\n";
   			if ($password) { 
   print "\n";
   print '				reader->setPassword(';
   print $password;
   print ');', "\n";
   			} 
   print "\n";
   		} 
   print "\n";
   print "\n";
   print '		//get hostPath parameter filename', "\n";
   print '		reader->setHost(';
   print $host;
   print ');', "\n";
   print '		reader->setPath(';
   print $path;
   print ');', "\n";
   		if ($filename) {
   print "\n";
   print '			reader->setFilename(';
   print $filename;
   print ');', "\n";
   		}
   print "\n";
   print "\n";
   print '		//check whether all data was sent from previous read', "\n";
   print '		size_t dataSize = data.size();', "\n";
   print '		if ((0 != dataSize)) {', "\n";
   print '			sendError("Start read with non empty data blob", iport$0);', "\n";
   print '			exit(1);', "\n";
   print '		}', "\n";
   print "\n";
   		if ($usePORT) { 
   print "\n";
   print '			reader->setUsePORT(';
   print $usePORT;
   print ');', "\n";
   		} 
   print "\n";
   		if ($connectionTimeout) { 
   print "\n";
   print '			reader->setConnectionTimeout(';
   print $connectionTimeout;
   print ');', "\n";
   		} 
   print "\n";
   		if ($transferTimeout) { 
   print "\n";
   print '			reader->setTransferTimeout(';
   print $transferTimeout;
   print ');', "\n";
   		} 
   print "\n";
   print "\n";
   print '		//prepare ituple pointer', "\n";
   print '		inTuple0 = &iport$0;', "\n";
   print '		sequence = 0;', "\n";
   print '		//perform operation', "\n";
   print '		if (reader->perform()) {', "\n";
   print '			SPLAPPTRC(L_DEBUG, "operation well performed", debugAspect);', "\n";
   print '			sendIntermediateTuples(iport$0);', "\n";
   print '			sendLeftoverTuple(iport$0);', "\n";
   print '		} else {', "\n";
   print '			sendError(reader->getError(), iport$0);', "\n";
   print '			data.clear();', "\n";
   print '		}', "\n";
   print '		submit(SPL::Punctuation(SPL::Punctuation::WindowMarker), 0);', "\n";
   print '		//invalidate ituple pointer', "\n";
   print '		inTuple0 = NULL;', "\n";
   print '		break;', "\n";
   print '	}', "\n";
   	if ($hasPasswordStream) { 
   print "\n";
   print '		case 1 : {', "\n";
   print '			IPort1Type const & iport$1 = static_cast<IPort1Type const &> (tuple);', "\n";
   print '			//set credentials', "\n";
   print '			reader->setUsername(';
   print $username;
   print ');', "\n";
   			if ($password) { 
   print "\n";
   print '				reader->setPassword(';
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
   print '			reader->onPunct();', "\n";
   print '			submit(SPL::Punctuation(SPL::Punctuation::WindowMarker), 0);', "\n";
   print '		}', "\n";
   print '	} else { //final marker', "\n";
   print '		SPLAPPTRC(L_DEBUG, "got a punct FinalMarker from port " << port, debugAspect);', "\n";
   print '	}', "\n";
   print '}', "\n";
   print "\n";
   print 'void MY_OPERATOR_SCOPE::MY_OPERATOR::sendIntermediateTuples(IPort0Type const & iport$0) {', "\n";
   print '	size_t size = data.size();', "\n";
   print '	char const * cp = data.c_str();', "\n";
   print '	//std::cout << "sendIntermediateTuples size=" << size << std::endl;', "\n";
   	if ($needBinaryData) { 
   print "\n";
   print '	if (size > 0) {', "\n";
   print '		OPort0Type otuple = generateOutTuple(cp, size, false, iport$0);', "\n";
   print '		submit(otuple, 0);', "\n";
   print '		data.clear();', "\n";
   print '	}', "\n";
   	} else { 
   print "\n";
   print '	if (size > 0) {', "\n";
   print '		char const * const end_cp = cp + size;', "\n";
   print '		bool eolFound = true;', "\n";
   print '		while(eolFound && (end_cp > cp)) {', "\n";
   print '			//const void * p1; const void * p2;', "\n";
   print '			//p1 = cp; p2 = end_cp;', "\n";
   print '			//std::cout << p1 << "\\n" << p2 << "\\n" << std::endl;', "\n";
   print '			size_t searchCount = end_cp - cp;', "\n";
   print '			char const * next = static_cast<char const *>(memchr(cp, \'\\n\', searchCount));', "\n";
   print '			if (next) {', "\n";
   print '				next++;', "\n";
   print '				eolFound = true;', "\n";
   print '			} else { //not found', "\n";
   print '				eolFound = false;', "\n";
   print '			}', "\n";
   print '			//std::cout << "eolFound=" << eolFound << std::endl;', "\n";
   print '			if (eolFound) {', "\n";
   print '				size_t blockLength = next - cp;', "\n";
   print '				//std::cout << "blocklen=" << blockLength << std::endl;', "\n";
   print '				OPort0Type otuple = generateOutTuple(cp, blockLength, false, iport$0);', "\n";
   print '				submit(otuple, 0);', "\n";
   print '				cp = next;', "\n";
   print '			}', "\n";
   print '		}', "\n";
   print '		if (!eolFound) {', "\n";
   print '			size_t leftoverSize = end_cp - cp;', "\n";
   print '			//std::cout << "leftoverSize=" << leftoverSize << std::endl;', "\n";
   print '			std::string restData(cp, leftoverSize);', "\n";
   print '			data = restData;', "\n";
   print '		} else {', "\n";
   print '			data.clear();', "\n";
   print '		}', "\n";
   print '	}', "\n";
   	} 
   print "\n";
   print '}', "\n";
   print "\n";
   print 'void MY_OPERATOR_SCOPE::MY_OPERATOR::sendLeftoverTuple(IPort0Type const & iport$0) {', "\n";
   print '	size_t size = data.size();', "\n";
   print '	//std::cout << "sendLeftoverTuple size=" << size << std::endl;', "\n";
   print '	if ';
   if ($isDirReader ne "true") {
   print '(';
   }
   print '(0 != size) ';
   if ($isDirReader ne "true") {
   print '|| (0 == sequence))';
   }
   print ' { //send a tuple with empty date for files with size 0', "\n";
   print '		char const * cp = data.c_str();', "\n";
   print '		OPort0Type otuple = generateOutTuple(cp, size, true, iport$0);', "\n";
   print '		submit(otuple, 0);', "\n";
   print '	}', "\n";
   print '	data.clear(); //all sent', "\n";
   print '}', "\n";
   print "\n";
   print 'MY_OPERATOR_SCOPE::MY_OPERATOR::OPort0Type MY_OPERATOR_SCOPE::MY_OPERATOR::generateOutTuple(char const * cp, uint64_t size, bool leftover, IPort0Type const & iport$0) {', "\n";
   print '	//send lines with final \\n', "\n";
    if ($needFileName || $needFileSize || $needFileDate || $needFileUser || $needFileGroup || $needFileInfo || $needIsFile) { 
   print "\n";
   print '	uint64_t dirlineSize = size;', "\n";
   print '	//send lines with final \\n', "\n";
   print '	if (!leftover) {', "\n";
   print '		dirlineSize--;', "\n";
   print '	}', "\n";
   print '	SPL::rstring myDirLine(cp, dirlineSize);', "\n";
   print '	const SPL::list<SPL::rstring> myList = SPL::Functions::String::tokenize(myDirLine, " ", false);', "\n";
    } 
   print "\n";
    if ($needFileName) { 
   print "\n";
   print '	SPL::rstring fileName("-----");', "\n";
   print '	if (myList.size() >= 9) {', "\n";
   print '		fileName = myList[8];', "\n";
   print '	} else {', "\n";
   print '		sendError("no FileName available during read of url=" + reader->getUrl() + " line=" + myDirLine, iport$0);', "\n";
   print '	}', "\n";
    } 
   print "\n";
    if ($needFileSize) { 
   print "\n";
   print '	uint64_t fileSize = 0;', "\n";
   print '	if (myList.size() >= 5) {', "\n";
   print '		fileSize = atoi(myList[4].c_str());', "\n";
   print '	} else {', "\n";
   print '		sendError("no FileSize available during read of url=" + reader->getUrl() + " line=" + myDirLine, iport$0);', "\n";
   print '	}', "\n";
    } 
   print "\n";
    if ($needFileDate) { 
   print "\n";
   print '	SPL::rstring fileDate("-------------");', "\n";
   print '	if (myList.size() >= 8) {', "\n";
   print '		fileDate = myList[5] + " " + myList[6] + " " + myList[7];', "\n";
   print '	} else {', "\n";
   print '		sendError("no FileDate available during read of url=" + reader->getUrl() + " line=" + myDirLine, iport$0);', "\n";
   print '	}', "\n";
    } 
   print "\n";
    if ($needFileUser) { 
   print "\n";
   print '	SPL::rstring fileUser("-----");', "\n";
   print '	if (myList.size() >= 3) {', "\n";
   print '		fileUser = myList[2];', "\n";
   print '	} else {', "\n";
   print '		sendError("no FileUser available during read of url=" + reader->getUrl() + " line=" + myDirLine, iport$0);', "\n";
   print '	}', "\n";
    } 
   print "\n";
    if ($needFileGroup) { 
   print "\n";
   print '	SPL::rstring fileGroup("-----");', "\n";
   print '	if (myList.size() >= 4) {', "\n";
   print '		fileGroup = myList[3];', "\n";
   print '	} else {', "\n";
   print '		sendError("no FileGroup available during read of url=" + reader->getUrl() + " line=" + myDirLine, iport$0);', "\n";
   print '	}', "\n";
    } 
   print "\n";
    if ($needFileInfo) { 
   print "\n";
   print '	SPL::rstring fileInfo("xxxxxxxxxx");', "\n";
   print '	if (myList.size() >= 1) {', "\n";
   print '		fileInfo = myList[0];', "\n";
   print '	} else {', "\n";
   print '		sendError("no FileInfo available during read of url=" + reader->getUrl() + " line=" + myDirLine, iport$0);', "\n";
   print '	}', "\n";
    } 
   print "\n";
    if ($needIsFile) { 
   print "\n";
   print '	SPL::boolean isFile = false;', "\n";
   print '	if ((myList.size() >=1) && (myList[0].size() > 0)) {', "\n";
   print '		if (myList[0][0] == \'-\') {', "\n";
   print '			isFile = true;', "\n";
   print '		}', "\n";
   print '	} else {', "\n";
   print '		sendError("no FileInfo available during read of url=" + reader->getUrl() + " line=" + myDirLine, iport$0);', "\n";
   print '	}', "\n";
    } 
   print "\n";
   print "\n";
   print "\n";
   	# generate the initializer for the tuple
   	my $init = "";
   	my $numAttrs = $mainOutputPort->getNumberOfAttributes();
   	for (my $i = 0; $i < $numAttrs; $i++) {
   		my $attr = $mainOutputPort->getAttributeAt($i);
   		my $aName = $attr->getName();
   		if ($attr->hasAssignmentWithOutputFunction()) {
   			my $of = $attr->getAssignmentOutputFunctionName();
   			if ($of eq "Binary") {
   				$init .= "SPL::blob((unsigned const char*)cp, size)";
   			} elsif ($of eq "Line") {
   				$init .= "SPL::rstring(cp, size)";
   			} elsif ($of eq "Url") {
   				$init .= "SPL::rstring(reader->getUrl())";
   			} elsif ($of eq "FileName") {
   				$init .= "SPL::rstring(fileName)";
   			} elsif ($of eq "FileSize") {
   				$init .= "SPL::uint64(fileSize)";
   			} elsif ($of eq "FileDate") {
   				$init .= "SPL::rstring(fileDate)";
   			} elsif ($of eq "FileUser") {
   				$init .= "SPL::rstring(fileUser)";
   			} elsif ($of eq "FileGroup") {
   				$init .= "SPL::rstring(fileGroup)";
   			} elsif ($of eq "FileInfo") {
   				$init .= "SPL::rstring(fileInfo)";
   			} elsif ($of eq "IsFile") {
   				$init .= "SPL::boolean(isFile)";
   			} elsif ($of eq "Sequence") {
   				$init .= "SPL::int32(sequence)";
   			} elsif ($of eq "NoTransfers") {
   				warnDeprecateCof("getNoTransfers()");
   				$init .= "SPL::uint32(reader->getNoTransfers())";
   			} elsif ($of eq "TransferCount") {
   				$init .= "SPL::uint32(reader->getNoTransfers())";
   			} elsif ($of eq "NoTransferFailures") {
   				warnDeprecateCof("NoTransferFailures()");
   				$init .= "SPL::uint32(reader->getNoTransferFailures())";
   			} elsif ($of eq "TransferFailureCount") {
   				$init .= "SPL::uint32(reader->getNoTransferFailures())";
   			} elsif ($of eq "NoBytesTransferred") {
   				warnDeprecateCof("NoBytesTransferred()");
   				$init .= "SPL::uint32(reader->getNoBytesTransferred())";
   			} elsif ($of eq "BytesTransferred") {
   				$init .= "SPL::uint32(reader->getNoBytesTransferred())";
   			} elsif ($of eq "TransferSpeed") {
   				$init .= "SPL::float64(reader->getTransferSpeed())";
   			} elsif ($of eq "AsIs") {
   				$init .= SPL::CodeGenHelper::ensureValue ($attr->getSPLType(), $attr->getAssignmentValue()->getCppExpression());
   			}
   		} else {
   			$init .= SPL::CodeGenHelper::ensureValue ($attr->getSPLType(), $attr->getAssignmentValue()->getCppExpression());
   		}
   		$init .= ",\n" if $i < $numAttrs-1;
   	}
   print "\n";
   print '	OPort0Type otuple = OPort0Type(';
   print $init;
   print ');', "\n";
   print '	/*MY_OPERATOR_SCOPE::MY_OPERATOR_SCOPE::MY_OPERATOR::OPort0Type otup(';
   print $init;
   print ');*/', "\n";
   print '	SPLAPPTRC(L_DEBUG, "send tuple sequence=" << sequence, debugAspect);', "\n";
   print '	SPLAPPTRC(L_TRACE, "otuple=" << otuple, debugAspect);', "\n";
   print '	sequence++;', "\n";
   print '	return otuple;', "\n";
   print '}', "\n";
   print "\n";
   print 'size_t MY_OPERATOR_SCOPE::MY_OPERATOR::callback(void * buffer, size_t size, size_t count, void * stream) {', "\n";
   print '	char const * cp = static_cast<char const*>(buffer);', "\n";
   print '	MY_OPERATOR * myOp = static_cast<MY_OPERATOR *>(stream);', "\n";
   print '	return myOp->writeToStream(buffer, size, count);', "\n";
   print '}', "\n";
   print "\n";
   print 'size_t MY_OPERATOR_SCOPE::MY_OPERATOR::writeToStream(void * buffer, size_t size, size_t count) {', "\n";
   print '	size_t res = size * count;', "\n";
   print '	//shutdown is handled from wrapper', "\n";
   print '	if (inTuple0) {', "\n";
   print '		sendIntermediateTuples(*inTuple0);', "\n";
   print '	} else {', "\n";
   print '		SPLAPPTRC(L_ERROR, "callback callend in wrong context", debugAspect);', "\n";
   print '	}', "\n";
   print '	char const * cp = static_cast<char const *>(buffer);', "\n";
   print '	data.append(cp, res);', "\n";
   print '	return res;', "\n";
   print '}', "\n";
   print "\n";
   print 'void MY_OPERATOR_SCOPE::MY_OPERATOR::sendError(SPL::rstring const & reason, IPort0Type const & iport$0) {', "\n";
   print '	SPL::rstring err2 = reason + " url:" + reader->getUrl();', "\n";
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
   						$init .= "SPL::uint32(reader->getResultCode())";
   					} elsif ($of eq "ErrorCode") {
   						$init .= "SPL::uint32(reader->getResultCode())";
   					} elsif ($of eq "ErrorText") {
   						$init .= "SPL::rstring(err2)";
   					} elsif ($of eq "Url") {
   						$init .= "SPL::rstring(reader->getUrl())";
   					} elsif ($of eq "NoTransfers") {
   						warnDeprecateCof("NoTransfers()");
   						$init .= "SPL::uint32(reader->getNoTransfers())";
   					} elsif ($of eq "TransferCount") {
   						$init .= "SPL::uint32(reader->getNoTransfers())";
   					} elsif ($of eq "NoTransferFailures") {
   						warnDeprecateCof("NoTransferFailures()");
   						$init .= "SPL::uint32(reader->getNoTransferFailures())";
   					} elsif ($of eq "TransferFailureCount") {
   						$init .= "SPL::uint32(reader->getNoTransferFailures())";
   					} elsif ($of eq "NoBytesTransferred") {
   						warnDeprecateCof("NoBytesTransferred()");
   						$init .= "SPL::uint32(reader->getNoBytesTransferred())";
   					} elsif ($of eq "BytesTransferred") {
   						$init .= "SPL::uint32(reader->getNoBytesTransferred())";
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
   print '	/*OPort1Type otuple(';
   print $init;
   print ');*/', "\n";
   print '	submit(otuple, 1);', "\n";
    } 
   print "\n";
   print '}', "\n";
   print "\n";
   print 'SPL::rstring MY_OPERATOR_SCOPE::MY_OPERATOR::debugAspect("FTPReader");', "\n";
   print "\n";
   SPL::CodeGen::implementationEpilogue($model);
   print "\n";
   print "\n";
   CORE::exit $SPL::CodeGen::USER_ERROR if ($SPL::CodeGen::sawError);
}
1;
