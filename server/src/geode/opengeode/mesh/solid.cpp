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

#include <geode/opengeode/mesh/solid.h>

#include <vtkPolyData.h>
#include <vtkPolygon.h>

#include <geode/mesh/core/polyhedral_solid.h>

#include <geode/opengeode/mesh/detail/geode_points.h>

namespace geode
{
    template < index_t dimension >
    void convert_solid_to_polydata(
        PolyhedralSolid< dimension > &mesh, vtkPolyData *polydata )
    {
        detail::set_geode_points( mesh, polydata );

        vtkSmartPointer< vtkCellArray > Facets = vtkCellArray::New();
        index_t nb{ 0 };
        for( const auto f : Range( mesh.nb_facets() ) )
        {
            nb += mesh.facet_vertices( f ).size();
        }
        Facets->AllocateExact( mesh.nb_facets(), nb );
        for( const auto f : Range( mesh.nb_facets() ) )
        {
            const auto &vertices = mesh.facet_vertices( f );
            absl::FixedArray< vtkIdType > vtk_vertices( vertices.size() );
            for( const auto v : Range( vertices.size() ) )
            {
                vtk_vertices[v] = vertices[v];
            }
            Facets->InsertNextCell( vtk_vertices.size(), vtk_vertices.data() );
        }
        polydata->SetPolys( Facets );
    }

    template void opengeode_geode_mesh_api convert_solid_to_polydata(
        PolyhedralSolid< 3 > &, vtkPolyData * );

} // namespace geode
