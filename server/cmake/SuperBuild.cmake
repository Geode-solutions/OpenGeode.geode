# Copyright (c) 2019 - 2020 Geode-solutions
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

if(NOT CPACK_PACKAGE_VERSION)
    set(CPACK_PACKAGE_VERSION "master")
endif()

set(OPENGEODE_IO_EXTRA_ARGS
    -DCPACK_SYSTEM_NAME:STRING=${CPACK_SYSTEM_NAME}
    -DCPACK_PACKAGE_VERSION:STRING=${CPACK_PACKAGE_VERSION}
    -DOPENGEODE_IO_WITH_TESTS:BOOL=${OPENGEODE_IO_WITH_TESTS}
)

if(NOT CMAKE_BUILD_TYPE AND NOT CMAKE_CONFIGURATION_TYPES)
    message(STATUS "Setting build type to 'Release' as none was specified.")
    set(CMAKE_BUILD_TYPE "Release" CACHE STRING 
        "Choose the type of build." FORCE)
    # Set the possible values of build type for cmake-gui
    set_property(CACHE CMAKE_BUILD_TYPE PROPERTY STRINGS
        "Debug" "Release" "MinSizeRel" "RelWithDebInfo")
endif()

# Begin configuration of the superbuild project
project(SuperBuild NONE)

# Additional cmake modules
include(ExternalProject)

include(${PROJECT_SOURCE_DIR}/cmake/ConfigureVtk.cmake)
#include(${PROJECT_SOURCE_DIR}/cmake/ConfigureOpenGeode_geode.cmake)
