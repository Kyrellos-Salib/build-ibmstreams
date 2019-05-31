# SPL_CGT_INCLUDE: InetRetrieverH.cgt
# SPL_CGT_INCLUDE: URIHelperH.cgt

package InetSource_h;
use strict; use Cwd 'realpath';  use File::Basename;  use lib dirname(__FILE__);  use SPL::Operator::Instance::OperatorInstance; use SPL::Operator::Instance::Annotation; use SPL::Operator::Instance::Context; use SPL::Operator::Instance::Expression; use SPL::Operator::Instance::ExpressionTree; use SPL::Operator::Instance::ExpressionTreeEvaluator; use SPL::Operator::Instance::ExpressionTreeVisitor; use SPL::Operator::Instance::ExpressionTreeCppGenVisitor; use SPL::Operator::Instance::InputAttribute; use SPL::Operator::Instance::InputPort; use SPL::Operator::Instance::OutputAttribute; use SPL::Operator::Instance::OutputPort; use SPL::Operator::Instance::Parameter; use SPL::Operator::Instance::StateVariable; use SPL::Operator::Instance::TupleValue; use SPL::Operator::Instance::Window; 
sub main::generate($$) {
   my ($xml, $signature) = @_;  
   print "// $$signature\n";
   my $model = SPL::Operator::Instance::OperatorInstance->new($$xml);
   unshift @INC, dirname ($model->getContext()->getOperatorDirectory()) . "/../impl/nl/include";
   $SPL::CodeGenHelper::verboseMode = $model->getContext()->isVerboseModeOn();
   # Copyright (C) 2010,2012,2014, International Business Machines Corporation. 
   # All Rights Reserved.
   print "\n";
   print '#include <vector>', "\n";
   print '#include<map>', "\n";
   print '#include<sstream>', "\n";
   print '#include <iostream>', "\n";
   print '#include <sstream>', "\n";
   print '#include <string>', "\n";
   print '#include <InetResource.h>', "\n";
   print "\n";
   print 'extern "C"', "\n";
   print '  {', "\n";
   print '#include<curl/curl.h>', "\n";
   print '  }', "\n";
   print "\n";
   print "\n";
   print "\n";
   print "\n";
   SPL::CodeGen::headerPrologue($model);
   print "\n";
   print "\n";
   print "\n";
   print "\n";
   print "\n";
   print 'typedef std::map<std::string, std::string> URIQueryComponentsNVP_t;', "\n";
   print 'typedef std::map<std::string, std::string>::iterator URIQueryComponentsNVP_it_t;', "\n";
   print 'typedef std::map<std::string, std::string>::const_iterator URIQueryComponentsNVP_cit_t;', "\n";
   print "\n";
   print '/// Return the input string with spaces suffixing it being removed', "\n";
   print '/// @param str input string', "\n";
   print '/// @param t character to be removed from right side of input string', "\n";
   print '/// @return input string without spaces suffixing it', "\n";
   print 'inline std::string rtrim(const std::string& source,', "\n";
   print '  const std::string& t=" ") {', "\n";
   print '  std::string str=source;', "\n";
   print '  return str.erase(str.find_last_not_of(t)+1);', "\n";
   print '}', "\n";
   print "\n";
   print '/// Return the input string with spaces prefixing it being removed', "\n";
   print '/// @param str input string', "\n";
   print '/// @param t character to be removed from left side of input string', "\n";
   print '/// @return input string without spaces prefixing it', "\n";
   print 'inline std::string ltrim(const std::string& source,', "\n";
   print '  const std::string & t = " " ) {', "\n";
   print '  std::string str = source;', "\n";
   print '  return str.erase (0,source.find_first_not_of(t));', "\n";
   print '}', "\n";
   print "\n";
   print '/// Return the input string with spaces suffixing and prefixing it being', "\n";
   print '/// removed', "\n";
   print '/// @param str input string', "\n";
   print '/// @param t character to be removed from left and right sides of input string', "\n";
   print '/// @return input string without spaces prefixing and suffixing it', "\n";
   print 'inline std::string trim(const std::string& source,', "\n";
   print '  const std::string& t=" ") {', "\n";
   print '  std::string str=source;', "\n";
   print '  return ltrim(rtrim(str,t),t);', "\n";
   print '}', "\n";
   print "\n";
   print "\n";
   print "\n";
   print '/// Converts a string to a different (numerical) type', "\n";
   print '/// @param t converted value', "\n";
   print '/// @param s input string', "\n";
   print 'template <class T> void fromString(T& t, const std::string& s) {', "\n";
   print '  if (s.empty()) {', "\n";
   print '    t=static_cast<T>(0);', "\n";
   print '  }', "\n";
   print '  else {', "\n";
   print '    std::istringstream iss(s);', "\n";
   print '    iss >> t;', "\n";
   print '    if (iss.fail())', "\n";
   print '      //THROW(FailedConversion,"string \'" << s << "\' conversion failed");', "\n";
   print '      throw std::exception();', "\n";
   print '    if (!iss.eof())', "\n";
   print '      throw std::exception();', "\n";
   print '      //      THROW(SpuriousCharacterFound,"string \'" << s << "\' contains spurious character");', "\n";
   print '  }', "\n";
   print '}', "\n";
   print "\n";
   print 'class MY_OPERATOR : public MY_BASE_OPERATOR ', "\n";
   print '{', "\n";
   print 'public:', "\n";
   print "\n";
   print '/*', "\n";
   print '*******************************************************************************', "\n";
   print '* Copyright (C) 2009,2012-2014, International Business Machines Corporation. ', "\n";
   print '* All Rights Reserved. *', "\n";
   print '*******************************************************************************', "\n";
   print '*/', "\n";
   print "\n";
   print '//', "\n";
   print '// Class Description:', "\n";
   print '//', "\n";
   print '// Mean to be included in CGT file.', "\n";
   print "\n";
   print '  /*', "\n";
   print '   * This class interacts with the cURL library, holding the contents of the file being retrieved and providing', "\n";
   print '   * a callback function for cURL to invoke when data is available from the file retrieval', "\n";
   print '   *', "\n";
   print '   * Preconditions: curl_global_init() has already been called before constructing objects of this type', "\n";
   print '   *', "\n";
   print '   * Postconditions: curl_global_cleanup() must be called after all objects of this type are destructed', "\n";
   print '   *', "\n";
   print '   */', "\n";
   print 'class InetRetriever', "\n";
   print '  {', "\n";
   print "\n";
   print "\n";
   print 'public:', "\n";
   print '  /*', "\n";
   print '   *  Constructor', "\n";
   print '   *', "\n";
   print '   * url        The URL, including protocol designation, of the target to be retrieved.', "\n";
   print '   *            This value may not be altered after the object has been constructed.', "\n";
   print '   *', "\n";
   print '   * Throws:    An integer if there was a problem during the construction of this object.', "\n";
   print '   *            Typically, this indicates that an error occurred during initialization of the', "\n";
   print '   *            cURL library used by this object.', "\n";
   print '   *            If the constructor throws an exception, the results from further use of the', "\n";
   print '   *            object are unpredictable.', "\n";
   print '   */', "\n";
   print '  InetRetriever(const std::string& url, const int timer=0) throw(int);', "\n";
   print "\n";
   print '  virtual ~InetRetriever();', "\n";
   print "\n";
   print '  /*', "\n";
   print '   * Clear all internal buffers, and reset byte counters to zero.', "\n";
   print '   */', "\n";
   print '  void reset();', "\n";
   print "\n";
   print '  /*', "\n";
   print '   * Retrieve the contents of the targURL previously supplied to the constructor, subject to', "\n";
   print '   * options previously set with the ignoreLastModTime() and/or incrementalFetch() methods.', "\n";
   print '   *', "\n";
   print '   * Returns:   A string containing the entire contents of the target, including any', "\n";
   print '   *            embedded newline characters.', "\n";
   print '   *', "\n";
   print '   * Throws:    The cURL return code from the fetch, if it is nonzero.', "\n";
   print '   */', "\n";
   print '  std::string fetch() throw(CURLcode);', "\n";
   print "\n";
   print '  std::string lastknownContents() const;', "\n";
   print "\n";
   print '  size_t bytesTransferredTotal();', "\n";
   print '  size_t bytesTransferredLastFetch();', "\n";
   print "\n";
   print '  void enableCurlTrace();', "\n";
   print '  void disableCurlTrace();', "\n";
   print "\n";
   print '  std::string targetURL() const;', "\n";
   print '  std::string effectiveURL() const;', "\n";
   print '  std::string contentType() const;', "\n";
   print '  long responseCode() const;', "\n";
   print '  double fetchTime() const;', "\n";
   print "\n";
   print '  // Returns true if the URL was updated, false if it stayed the same.', "\n";
   print '  bool updateURL(std::string newURL);', "\n";
   print "\n";
   print '  void ignoreLastModTime();', "\n";
   print '  void ignoreLastModTime(bool whether);', "\n";
   print "\n";
   print '  void incrementalFetch();', "\n";
   print '  void incrementalFetch(bool whether);', "\n";
   print "\n";
   print '  /*', "\n";
   print '   * To be used for calling certain curl_easy_setopt() and/or curl_easy_getinfo() functions ONLY.', "\n";
   print '   * In addition, the following curl_easy_setopt() options *shall not* be called by users; if they', "\n";
   print '   * are called, the results are unpredictable:', "\n";
   print '   * - Any whose name ends with FUNCTION or DATA (e.g. WRITEFUNCTION, WRITEDATA, and so on)', "\n";
   print '   * - CURLOPT_URL, CURLOPT_FILETIME, CURLOPT_TIMECONDITION, CURLOPT_TIMEVALUE', "\n";
   print '   *', "\n";
   print '   */', "\n";
   print '  CURL* curlHandle();', "\n";
   print "\n";
   print 'private:', "\n";
   print '  static', "\n";
   print '  size_t consumeData_static(void* buffer, const size_t recSize,', "\n";
   print '      const size_t numRecs, void* objPtr);', "\n";
   print "\n";
   print '  /*', "\n";
   print '   *  Callback function -- called by cURL when it has data to supply', "\n";
   print '   */', "\n";
   print '  size_t consumeData(const void* data, const size_t recSize,', "\n";
   print '      const size_t numRecs);', "\n";
   print "\n";
   print '  // Disallow copying and assignment of this object (it doesn\'t make sense semantically)', "\n";
   print '  InetRetriever(const InetRetriever& cr);', "\n";
   print "\n";
   print '  InetRetriever& operator=(const InetRetriever& cr);', "\n";
   print "\n";
   print '  /*', "\n";
   print '   *  Instance variables', "\n";
   print '   */', "\n";
   print "\n";
   print '  size_t        _bytesTransferredTotal, _bytesTransferredLastFetch;', "\n";
   print '  std::string   _targetURL, _effectiveURL, _contentType, _curlBuffer, _fileCache;', "\n";
   print '  long          _lastModTime;', "\n";
   print '  int           _timeout, _responseCode;', "\n";
   print '  double        _fetchTime;', "\n";
   print '  bool          _ignoreLastModTime, _incrementalFetch, _dataCameBack;', "\n";
   print '  CURL*         _curlHandle;', "\n";
   print "\n";
   print '  }; // Class InetRetriever', "\n";
   print "\n";
   print '/*', "\n";
   print '*******************************************************************************', "\n";
   print '* Copyright (C) 2007,2012-2014, International Business Machines Corporation. ', "\n";
   print '* All Rights Reserved. *', "\n";
   print '*******************************************************************************', "\n";
   print '*/', "\n";
   print "\n";
   print '// Class Description:', "\n";
   print '//', "\n";
   print '// Contains the code for URIHelper, which is used by the InetSource operator.  This', "\n";
   print '// file is meant to be included in a CGT file and cannot be compiled standalone.', "\n";
   print "\n";
   print "\n";
   print 'class URIQueryComponents {', "\n";
   print '  public:', "\n";
   print '    URIQueryComponentsNVP_t nameValuePairs;', "\n";
   print '  public:', "\n";
   print '    /// Print internal state to an output stream', "\n";
   print '    /// @param o output stream', "\n";
   print '    void print(std::ostream& o) const;', "\n";
   print '  friend std::ostream& operator<< (std::ostream& o, const URIQueryComponents& qc);', "\n";
   print '};', "\n";
   print "\n";
   print 'class URIHelper {', "\n";
   print '  public:', "\n";
   print '    enum ProtocolType {', "\n";
   print '      UNDEFINED = -1,', "\n";
   print '      FILE = 8,', "\n";
   print '      HTTP = 9,', "\n";
   print '      FTP = 10', "\n";
   print '    };', "\n";
   print "\n";
   print '    /// Default constructor', "\n";
   print '    URIHelper(void);', "\n";
   print "\n";
   print '    /// Construct a valid URI', "\n";
   print '    /// @param uri a string with the URI', "\n";
   print '    URIHelper(const std::string& uri);', "\n";
   print "\n";
   print '    /// Initialize an empty URI object', "\n";
   print '    /// @param uri a string with the URI', "\n";
   print '    void init(const std::string& uri);', "\n";
   print "\n";
   print '    /// Retrieve the protocol specified as part of the URI', "\n";
   print '    /// @return the protocol', "\n";
   print '    inline ProtocolType getProtocol(void) const { return proto; };', "\n";
   print "\n";
   print '    /// Retrieve the protocol specified as part of the URI', "\n";
   print '    /// @return the protocol', "\n";
   print '    inline const std::string& getProtocolName(void) const { return protocol; };', "\n";
   print "\n";
   print '    /// Retrieve the host specified as part of the URI', "\n";
   print '    /// @return the host', "\n";
   print '    inline const std::string& getHost(void) const { return host; };', "\n";
   print "\n";
   print '    /// Return whether the host is a multicast address', "\n";
   print '    /// @return true or false', "\n";
   print '    bool isMulticastAddress(void) const;', "\n";
   print "\n";
   print '    /// Retrieve the user information specified as part of the URI', "\n";
   print '    /// @return the user info', "\n";
   print '    inline const std::string& getUserInfo(void) const { return userinfo; };', "\n";
   print "\n";
   print '    /// Retrieve the port number specified as part of the URI', "\n";
   print '    /// @return the port number', "\n";
   print '    inline int getPort(void) const { return portnum; };', "\n";
   print "\n";
   print '    /// Retrieve the path specified as part of the URI', "\n";
   print '    /// @return the path', "\n";
   print '    inline const std::string& getPath(void) const { return path; };', "\n";
   print "\n";
   print '    /// Retrieve the query specified as part of the URI', "\n";
   print '    /// @return the query', "\n";
   print '    inline const std::string& getQuery(void) const { return query; };', "\n";
   print "\n";
   print '    /// Retrieve a reference to the internal URIQueryComponents object', "\n";
   print '    /// @return a reference to the underlying URIQueryComponents object', "\n";
   print '    const URIQueryComponents& getQueryComponents(void) const {', "\n";
   print '      return qc;', "\n";
   print '    };', "\n";
   print "\n";
   print '    /// Retrieve a reference to the name-value pairs in the underlying', "\n";
   print '    /// URIQueryComponents object', "\n";
   print '    /// @return a reference to the collection of name-value pairs', "\n";
   print '    const URIQueryComponentsNVP_t& getQCNameValuePairs(void) const {', "\n";
   print '      return qc.nameValuePairs;', "\n";
   print '    };', "\n";
   print "\n";
   print "\n";
   print '    /// Tokenize a string', "\n";
   print '    /// @param str string to be tokenized', "\n";
   print '    /// @param tokens vector with the list of tokens', "\n";
   print '    /// @param delimiters string with the characters delimiting each token', "\n";
   print '    /// @param keepEmptyTokens keep empty tokens', "\n";
   print '    void tokenize(const std::string& str, std::vector<std::string>& tokens,', "\n";
   print '              const std::string& delimiter, bool keepEmptyTokens) ;', "\n";
   print "\n";
   print '    /// Destructor', "\n";
   print '    ~URIHelper(void) {};', "\n";
   print '  protected:', "\n";
   print '    enum {', "\n";
   print '      SCHEME_NUM = 2,', "\n";
   print '      USERINFO_NUM = 4,', "\n";
   print '      HOST_NUM = 5,', "\n";
   print '      HOSTNAME_NUM = 6,', "\n";
   print '      IPV4ADDR_NUM = 10,', "\n";
   print '      PORT_NUM = 12,', "\n";
   print '      PATH_NUM = 13,', "\n";
   print '      QUERY_NUM = 21,', "\n";
   print '      NMATCH = QUERY_NUM+1', "\n";
   print '    };', "\n";
   print "\n";
   print '    /// Parse a URI into its components', "\n";
   print '    /// @param uri the string with the URI to be parsed', "\n";
   print '    /// @return true if the string was properly formatted as an URI', "\n";
   print '    bool parseURI(const std::string& uri);', "\n";
   print "\n";
   print '    /// Retrieve the query components from the query string and', "\n";
   print '    /// build URIQueryComponents object', "\n";
   print '    void retrieveQueryComponents(void);', "\n";
   print "\n";
   print '    /// Print internal state to an output stream', "\n";
   print '    /// @param o output stream', "\n";
   print '    public: ', "\n";
   print '    void print(std::ostream& o) const;', "\n";
   print '    protected: ', "\n";
   print '    ProtocolType proto;', "\n";
   print '    std::string protocol;', "\n";
   print '    std::string userinfo;', "\n";
   print '    std::string host;', "\n";
   print '    int portnum;', "\n";
   print '    std::string port;', "\n";
   print '    std::string path;', "\n";
   print '    std::string query;', "\n";
   print '    URIQueryComponents qc;', "\n";
   print "\n";
   print '    static const char* URIREGEX;', "\n";
   print '    friend std::ostream& operator<< (std::ostream& o, const URIHelper& uri);', "\n";
   print '};', "\n";
   print "\n";
   print "\n";
   print 'public:', "\n";
   print "\n";
   print '  // ----------- standard operator methods ----------', "\n";
   print "\n";
   print '  MY_OPERATOR();', "\n";
   print '  virtual ~MY_OPERATOR(); ', "\n";
   print '  void allPortsReady(); ', "\n";
   print '  void prepareToShutdown(); ', "\n";
   print '  void process(uint32_t idx);', "\n";
   print "\n";
   print '  // ----------- ???? ----------', "\n";
   print "\n";
   print '  //???MY_OPERATOR(const MY_OPERATOR& op);', "\n";
   print '  //???MY_OPERATOR& operator=(const MY_OPERATOR& op);', "\n";
   print "\n";
   print '  // ----------- InetSource operator methods  ----------', "\n";
   print "\n";
   print '  void addRetriever(const std::string & url, int timeout);', "\n";
   print '  std::string checkURI(const std::string & url);', "\n";
   print "\n";
   print 'private:', "\n";
   print "\n";
   print '  // ----------- operator state variables ----------', "\n";
   print "\n";
   print '  std::string relFileProtocol;', "\n";
   print '  std::string absFileProtocol;', "\n";
   print '  std::vector<InetRetriever*> retrievers_;', "\n";
   print '  InetRetriever* retriever_;', "\n";
   print '  int timeout_;', "\n";
   print '  std::vector<std::pair<int,uint32_t> > retCodeCounts_;', "\n";
   print '  uint32_t inputLinesPerRecord_;', "\n";
   print '  SPL::rstring intraRecordPadValue_;', "\n";
   print '  SPL::float64 fetchInterval_;', "\n";
   print '  bool punctPerFetch_;', "\n";
   print '  int32_t iterations_;', "\n";
   print '  int32_t iteration_;', "\n";
   print '  uint32_t emitTuplePerRecordCount_;', "\n";
   print '  bool dynamicURL_;', "\n";
   print "\n";
   print '  // ----------- operator output tuple ----------', "\n";
   print "\n";
   print '  OPort0Type outputTuple;', "\n";
   print "\n";
   print '  // ----------- assignment functions for output attributes ----------', "\n";
   print "\n";
   print '  SPL::rstring TargetURL() { return retriever_->targetURL(); }', "\n";
   print '  SPL::rstring EffectiveURL() { return retriever_->effectiveURL(); }', "\n";
   print '  SPL::rstring ContentType() { return retriever_->contentType(); }', "\n";
   print '  SPL::int32 ResponseCode() { return retriever_->responseCode(); }', "\n";
   print '  SPL::float64 FetchTime() { return retriever_->fetchTime(); }', "\n";
   print "\n";
   print '}; ', "\n";
   print "\n";
   SPL::CodeGen::headerEpilogue($model);
   print "\n";
   print "\n";
   CORE::exit $SPL::CodeGen::USER_ERROR if ($SPL::CodeGen::sawError);
}
1;
