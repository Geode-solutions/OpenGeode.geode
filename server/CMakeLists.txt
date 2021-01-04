# Copyright (c) 2019 - 2021 Geode-solutions
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

cmake_minimum_required(VERSION 3.13)

# Define the project
project(OpenGeode_geode CXX)

# Get OpenGeode_geode dependencies
find_package(OpenGeode REQUIRED)
find_package(VTK REQUIRED CONFIG NO_DEFAULT_PATH PATHS "../node_modules/@geode/geode-tools/build/vtk/install")

set(CMAKE_INSTALL_PREFIX "${CMAKE_BINARY_DIR}/install")

#------------------------------------------------------------------------------------------------
# Configure the OpenGeode_geode libraries
add_subdirectory(src/geode)

#------------------------------------------------------------------------------------------------
# Configure the OpenGeode_geode bindings
add_subdirectory(bindings/python)

#------------------------------------------------------------------------------------------------
# Configure CPack
if(WIN32)
    set(CPACK_GENERATOR "ZIP")
else()
    set(CPACK_GENERATOR "TGZ")
endif()

# This must always be last!
include(CPack)
