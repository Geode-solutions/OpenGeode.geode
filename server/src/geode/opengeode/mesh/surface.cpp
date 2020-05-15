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

#include <geode/mesh/core/polygonal_surface.h>

#include <geode/opengeode/mesh/detail/geode_points.h>
#include <geode/opengeode/mesh/detail/vtk_xml.h>

namespace geode
{
    template < index_t dimension >
    void convert_surface_to_polydata(
        PolygonalSurface< dimension > &mesh, vtkPolyData *polydata )
    {
        detail::set_geode_points( mesh, polydata );

        vtkSmartPointer< vtkCellArray > Polygons = vtkCellArray::New();
        index_t nb{ 0 };
        for( const auto p : Range( mesh.nb_polygons() ) )
        {
            nb += mesh.nb_polygon_vertices( p );
        }
        Polygons->AllocateExact( mesh.nb_polygons(), nb );
        for( const auto p : Range( mesh.nb_polygons() ) )
        {
            absl::FixedArray< vtkIdType > polygon(
                mesh.nb_polygon_vertices( p ) );
            for( const auto v : Range( mesh.nb_polygon_vertices( p ) ) )
            {
                polygon[v] = mesh.polygon_vertex( { p, v } );
            }
            Polygons->InsertNextCell( polygon.size(), polygon.data() );
        }
        polydata->SetPolys( Polygons );
    }

    template < index_t dimension >
    std::string extract_surface_wireframe( PolygonalSurface< dimension > &mesh )
    {
        vtkSmartPointer< vtkPolyData > polydata = vtkPolyData::New();
        detail::set_geode_points( mesh, polydata );

        vtkSmartPointer< vtkCellArray > edges = vtkCellArray::New();
        const auto nb_edges = mesh.nb_edges();
        edges->AllocateExact( nb_edges, nb_edges * 2 );
        for( const auto e : Range{ nb_edges } )
        {
            const auto &vertices = mesh.edge_vertices( e );
            edges->InsertNextCell( { vertices[0], vertices[1] } );
        }
        polydata->SetLines( edges );
        return detail::export_xml( polydata );
    }

    template std::string opengeode_geode_mesh_api extract_surface_wireframe(
        PolygonalSurface< 2 > & );
    template std::string opengeode_geode_mesh_api extract_surface_wireframe(
        PolygonalSurface< 3 > & );

    template void opengeode_geode_mesh_api convert_surface_to_polydata(
        PolygonalSurface< 2 > &, vtkPolyData * );
    template void opengeode_geode_mesh_api convert_surface_to_polydata(
        PolygonalSurface< 3 > &, vtkPolyData * );

} // namespace geode
