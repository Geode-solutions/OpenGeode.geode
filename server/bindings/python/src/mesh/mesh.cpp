/*
 * Copyright (c) 2019 - 2021 Geode-solutions
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

#include <pybind11/iostream.h>
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

// #include <vtkPolyData.h>
// #include <vtkPythonArgs.h>

#include "edged_curve.h"
#include "point_set.h"
#include "solid.h"
#include "surface.h"

namespace pybind11
{
    namespace detail
    {
        // template <>
        // struct type_caster< vtkPolyData >
        //     : public type_caster_base< vtkPolyData >
        // {
        //     bool load( handle src, bool )
        //     {
        //         if( !src )
        //         {
        //             return false;
        //         }
        //         auto *ptr =
        //             vtkPythonArgs::GetSelfPointer( src.ptr(), src.ptr() );
        //         value = static_cast< vtkPolyData * >( ptr );
        //         return true;
        //     }

        //     static handle cast( vtkPolyData *v,
        //         return_value_policy /*policy*/,
        //         handle /*parent*/ )
        //     {
        //         return vtkPythonArgs::BuildVTKObject( v );
        //     }
        // };
    } // namespace detail
} // namespace pybind11

PYBIND11_MODULE( opengeode_geode_py_mesh, module )
{
    pybind11::module::import( "opengeode" );
    pybind11::add_ostream_redirect( module );
    module.doc() = "OpenGeode Python binding for Geode mesh extension";
    geode::define_point_set( module );
    geode::define_edged_curve( module );
    geode::define_surface( module );
    geode::define_solid( module );
}