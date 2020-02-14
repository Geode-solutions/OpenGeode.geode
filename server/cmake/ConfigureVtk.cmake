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

set(VTK_PATH ${PROJECT_BINARY_DIR}/third_party/vtk)
set(VTK_INSTALL_PREFIX ${VTK_PATH}/install)
string(REPLACE "/MDd" "/MD" NEW_FLAGS ${CMAKE_CXX_FLAGS_DEBUG})
set(Python_version 2)
find_package(PythonLibs 3 QUIET)
if(PYTHONLIBS_FOUND)
    set(Python_version 3)
endif()
ExternalProject_Add(vtk
    PREFIX ${VTK_PATH}
    GIT_REPOSITORY https://github.com/Kitware/VTK
    GIT_TAG 1b16528aea2605a33715187889f30594d02e3ea7
    GIT_PROGRESS ON
    CMAKE_GENERATOR ${CMAKE_GENERATOR}
    CMAKE_GENERATOR_PLATFORM ${CMAKE_GENERATOR_PLATFORM}
    CMAKE_ARGS
        -DCMAKE_CXX_COMPILER=${CMAKE_CXX_COMPILER}
        -DCMAKE_INSTALL_MESSAGE=LAZY
        -DCMAKE_BUILD_TYPE=${CMAKE_BUILD_TYPE}
    CMAKE_CACHE_ARGS
        -DCMAKE_C_FLAGS_DEBUG:INTERNAL=${NEW_FLAGS}
        -DCMAKE_CXX_FLAGS_DEBUG:INTERNAL=${NEW_FLAGS}
        -DVTK_WRAP_PYTHON:BOOL=ON
        -DVTK_PYTHON_VERSION:STRING=${Python_version}
        -DVTK_GROUP_ENABLE_Web:STRING=YES
        -DVTK_BUILD_TESTING:BOOL=OFF
        -DVTK_LEGACY_REMOVE:BOOL=ON
        -DCMAKE_INSTALL_PREFIX:PATH=${VTK_INSTALL_PREFIX}
)
