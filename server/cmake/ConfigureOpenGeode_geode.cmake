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

set(OpenGeode_geode_PATH_BIN ${PROJECT_BINARY_DIR}/opengeode_geode)
ExternalProject_Add(opengeode_geode
    PREFIX ${OpenGeode_geode_PATH_BIN}
    SOURCE_DIR ${PROJECT_SOURCE_DIR}
    CMAKE_GENERATOR ${CMAKE_GENERATOR}
    CMAKE_GENERATOR_PLATFORM ${CMAKE_GENERATOR_PLATFORM}
    CMAKE_ARGS
        -DCMAKE_CXX_COMPILER=${CMAKE_CXX_COMPILER}
        -DCMAKE_BUILD_TYPE=${CMAKE_BUILD_TYPE}
        -DCMAKE_PREFIX_PATH=${CMAKE_PREFIX_PATH}
        -DCMAKE_INSTALL_MESSAGE=LAZY
    CMAKE_CACHE_ARGS
        ${OPENGEODE_IO_EXTRA_ARGS}
        -DUSE_SUPERBUILD:BOOL=OFF
        -DVTK_INSTALL_PREFIX:PATH=${VTK_INSTALL_PREFIX}
        -DPYBIND11_INSTALL_PREFIX:PATH=${PYBIND11_INSTALL_PREFIX}
        -DCMAKE_INSTALL_PREFIX:PATH=${OpenGeode_geode_PATH_BIN}/install
    BINARY_DIR ${OpenGeode_geode_PATH_BIN}
    DEPENDS 
        vtk
)
