// DO NOT EDIT THIS FILE - it is machine generated
#ifndef SPL_JNIFunctions_com_ibm_streamsx_inet_rest_h
#define SPL_JNIFunctions_com_ibm_streamsx_inet_rest_h

#include <SPL/Runtime/Function/SPLJavaFunction.h>
#include <SPL/Runtime/Type/SPLType.h>

namespace SPL {
namespace JNIFunctions {
namespace com {
namespace ibm {
namespace streamsx {
namespace inet {
namespace rest {
class SPL_JNIFunctions {
public:

// Generated from com.ibm.streamsx.inet.rest.ops.Functions in impl/lib/com.ibm.streamsx.inet.jar at Tue May 14 16:42:07 EDT 2019
static SPL::ustring obfuscate(SPL::ustring const & arg1) {
    static __thread void *func;
    static __thread jclass classGlobalRef;
    static __thread jmethodID mid;
    if (func == NULL) {
        func = SPL::SPLJavaFunction::loadFunction("com.ibm.streamsx.inet", "2.9.6", SPLJAVAFUNCTION_ADL_FILENAME, "impl/lib/com.ibm.streamsx.inet.jar", "com.ibm.streamsx.inet.rest.ops.Functions", "obfuscate", "(Ljava/lang/String;)Ljava/lang/String;", "com.ibm.streamsx.inet.rest", "<string T> public T obfuscate(T password)", &classGlobalRef, &mid);
    }
    JNIEnv* env = SPL::SPLJavaFunction::getJNIEnv(func);
    jstring obj1 = env->NewString((jchar *) arg1.getBuffer(), (jsize) arg1.length());
    if (env->ExceptionCheck())
        SPL::SPLJavaFunction::throwCreateError(func);
    jstring resObj = (jstring) env->CallStaticObjectMethod(classGlobalRef, mid, obj1);
    if (env->ExceptionCheck())
        SPL::SPLJavaFunction::throwCallError(func);
    env->DeleteLocalRef(obj1);
    if (resObj != NULL) {
        const jchar *chars = env->GetStringChars(resObj, NULL);
        if (chars == NULL)
            SPL::SPLJavaFunction::throwCreateError(func);
        SPL::ustring result((const UChar *) chars, (int32_t) env->GetStringLength(resObj));
        env->ReleaseStringChars(resObj, chars);
        env->DeleteLocalRef(resObj);
        return result;
    } else {
        return SPL::ustring::fromUTF8("");
    }
}

// Generated from com.ibm.streamsx.inet.rest.ops.Functions in impl/lib/com.ibm.streamsx.inet.jar at Tue May 14 16:42:07 EDT 2019
static SPL::rstring obfuscate(SPL::rstring const & arg1) {
    SPL::ustring result = obfuscate(SPL::ustring::fromUTF8(arg1));
    return SPL::ustring::toUTF8(result);
}

// Generated from com.ibm.streamsx.inet.rest.ops.Functions in impl/lib/com.ibm.streamsx.inet.jar at Tue May 14 16:42:07 EDT 2019
template <SPL::int32 msize>
static SPL::bstring<msize> obfuscate(SPL::bstring<msize> const & arg1) {
    SPL::rstring result = obfuscate((SPL::rstring) arg1);
    return (SPL::bstring<msize>) result;
}

};
}
}
}
}
}
}
}
#endif
