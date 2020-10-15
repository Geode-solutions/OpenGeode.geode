/*
 * Copyright (c) 2019 - 2020 Geode-solutions
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

#include <geode/opengeode/mesh/surface.h>

#include <vtkPolyData.h>

#include <geode/mesh/core/surface_mesh.h>

#define PYTHON_SURFACE( dimension )                                            \
    const auto convert##dimension =                                            \
        "convert_surface_to_polydata" + std::to_string( dimension ) + "D";     \
    module.def( convert##dimension.c_str(),                                    \
        &convert_surface_to_polydata< dimension > );                           \
    const auto extract##dimension =                                            \
        "extract_surface_wireframe" + std::to_string( dimension ) + "D";       \
    module.def(                                                                \
        extract##dimension.c_str(), &extract_surface_wireframe< dimension > )

namespace geode
{
    void define_surface( pybind11::module& module )
    {
        PYTHON_SURFACE( 2 );
        PYTHON_SURFACE( 3 );
    }
} // namespace geode
