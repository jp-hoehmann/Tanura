#!/usr/bin/env bash

#
# Common exit codes.
#
# This script defines common exit codes used in the other scripts.
#
# Adapted from sysexits.h.
#
# Copyright (c) 1987, 1993
#	The Regents of the University of California.  All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
# 1. Redistributions of source code must retain the above copyright
#    notice, this list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright
#    notice, this list of conditions and the following disclaimer in the
#    documentation and/or other materials provided with the distribution.
# 4. Neither the name of the University nor the names of its contributors
#    may be used to endorse or promote products derived from this software
#    without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
# ARE DISCLAIMED.  IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE
# FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
# OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
# HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
# LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
# OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
# SUCH DAMAGE.
#

# Successful termination.
#
EX_OK=0

# Unknown error.
#
EX_FAIL=1

# Base value for error messages.
#
EX__BASE=64

# Command line usage error.
#
# The command was used incorrectly, e.g., with	the wrong number of
# arguments, a bad flag, a bad syntax in a parameter, or whatever.
#
EX_USAGE=64

# Data format error.
#
# The input data was incorrect in some way.	This should only be used
# for user's data & not system files.
#
EX_DATAERR=65

# Cannot open input.
#
# An input file (not a system file) did not exist or was not readable.
# This could also include errors like "No message" to a mailer (if it
# cared to catch it).
#
EX_NOINPUT=66

# Addressee unknown.
#
# The user specified did not exist.  This might	be used for mail
# addresses or remote logins.
#
EX_NOUSER=67

# Host name unknown.
#
# The host specified did not exist.  This is used	in mail addresses or
# network requests.
#
EX_NOHOST=68

# Service unavailable.
#
# A service is unavailable.  This can occur if a support program or
# file does not exist.  This can also be used as a catchall message
# when something you wanted to do doesn't work, but you don't know
# why.
#
EX_UNAVAILABLE=69

# Internal software error.
#
# An internal software error has been detected. This should be limited
# to non-operating system related errors as possible.
#
EX_SOFTWARE=70

# System error (e.g. can't fork).
#
# An operating system error has been detected. This is intended to be
# used for such things as "cannot fork", "cannot create pipe", or the
# like.  It includes things like getuid returning a user that does not
# exist in the passwd file.
#
EX_OSERR=71

# Critical OS file missing.
#
# Some system file (e.g., /etc/passwd, /etc/utmp, etc.) does not exist,
# cannot be opened, or has some sort of error (e.g., syntax error).
#
EX_OSFILE=72

# Cannot create (user) output file.
#
# A (user specified) output file cannot be	created.
#
EX_CANTCREAT=73

# Input/output error.
#
# An error occurred while doing I/O on some file.
#
EX_IOERR=74

# Temp failure; user is invited to retry.
#
# Temporary failure, indicating something that is not really an error.
# In sendmail, this means that a mailer (e.g.) could not create
# a connection, and the request should be reattempted later.
#
EX_TEMPFAIL=75

# Remote error in protocol.
#
# The remote system returned something that was "not possible" during
# a protocol exchange.
#
EX_PROTOCOL=76

# Permission denied.
#
# You did not have sufficient permission to perform the operation.
# This is not intended for file system problems, which should use
# NOINPUT or CANTCREAT, but rather for higher level permissions.
#
EX_NOPERM=77

# Configuration error.
#
EX_CONFIG=78

# Maximum listed value.
#
EX__MAX=78
