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

#include <geode/opengeode/mesh/point_set.h>

#include <vtkPolyData.h>

#include <geode/mesh/core/point_set.h>

#include <geode/opengeode/mesh/detail/geode_points.h>
#include <geode/opengeode/mesh/detail/vtk_xml.h>

namespace
{
    template < geode::index_t dimension >
    void extract_vertices(
        geode::PointSet< dimension > &mesh, vtkPolyData *polydata )
    {
        vtkSmartPointer< vtkCellArray > Points = vtkCellArray::New();
        const auto nb_vertices = mesh.nb_vertices();
        Points->AllocateExact( nb_vertices, nb_vertices );
        for( const auto v : geode::Range{ nb_vertices } )
        {
            Points->InsertNextCell( { v } );
        }
        polydata->SetVerts( Points );
    }
} // namespace

namespace geode
{
    template < index_t dimension >
    void convert_point_set_to_polydata(
        PointSet< dimension > &mesh, vtkPolyData *polydata )
    {
        detail::set_geode_points( mesh, polydata );
        extract_vertices( mesh, polydata );
    }

    template < index_t dimension >
    std::string extract_point_set_points( PointSet< dimension > &mesh )
    {
        vtkSmartPointer< vtkPolyData > polydata = vtkPolyData::New();
        detail::set_geode_points( mesh, polydata );
        extract_vertices( mesh, polydata );
        return detail::export_xml( polydata );
    }

    template std::string opengeode_geode_mesh_api extract_point_set_points(
        PointSet< 2 > & );
    template std::string opengeode_geode_mesh_api extract_point_set_points(
        PointSet< 3 > & );

    template void opengeode_geode_mesh_api convert_point_set_to_polydata(
        PointSet< 2 > &, vtkPolyData * );
    template void opengeode_geode_mesh_api convert_point_set_to_polydata(
        PointSet< 3 > &, vtkPolyData * );

} // namespace geode
