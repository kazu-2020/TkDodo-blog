# FIX Error SSL_connect returned=1 errno=0 state=error: wrong signature type
require 'openssl'
OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
