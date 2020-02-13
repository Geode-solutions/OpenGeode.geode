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
#include <vtkTriangle.h>

#include <geode/mesh/core/polygonal_surface.h>

#include <geode/opengeode/mesh/detail/geode_points.h>

namespace geode
{
    template < index_t dimension >
    void convert_surface_to_polydata(
        PolygonalSurface< dimension > &mesh, vtkPolyData *polydata )
    {
        auto *points =
            new detail::GeodePoints< PolygonalSurface, dimension >( mesh );
        auto *Points = vtkPoints::New();
        Points->SetData( points );

        auto *Triangles = vtkCellArray::New();
        for( const auto t : Range( mesh.nb_polygons() ) )
        {
            auto *Triangle = vtkTriangle::New();
            Triangle->GetPointIds()->SetId(
                0, mesh.polygon_vertex( { t, 0 } ) );
            Triangle->GetPointIds()->SetId(
                1, mesh.polygon_vertex( { t, 1 } ) );
            Triangle->GetPointIds()->SetId(
                2, mesh.polygon_vertex( { t, 2 } ) );
            Triangles->InsertNextCell( Triangle );
        }
        polydata->SetPoints( Points );
        polydata->SetPolys( Triangles );
    }

    template void opengeode_geode_mesh_api convert_surface_to_polydata(
        PolygonalSurface< 2 > &, vtkPolyData * );
    template void opengeode_geode_mesh_api convert_surface_to_polydata(
        PolygonalSurface< 3 > &, vtkPolyData * );

} // namespace geode
