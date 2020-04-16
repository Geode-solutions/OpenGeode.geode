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

#include <geode/opengeode/mesh/edged_curve.h>

#include <vtkPolyData.h>

#include <geode/mesh/core/edged_curve.h>

#include <geode/opengeode/mesh/detail/geode_points.h>

namespace geode
{
    template < index_t dimension >
    void convert_edged_curve_to_polydata(
        EdgedCurve< dimension > &mesh, vtkPolyData *polydata )
    {
        detail::set_geode_points( mesh, polydata );

        vtkSmartPointer< vtkCellArray > Edges = vtkCellArray::New();
        Edges->AllocateExact( mesh.nb_edges(), mesh.nb_edges() * 2 );
        for( const auto e : Range( mesh.nb_edges() ) )
        {
            Edges->InsertNextCell( { mesh.edge_vertex( { e, 0 } ),
                mesh.edge_vertex( { e, 1 } ) } );
        }
        polydata->SetLines( Edges );
    }

    template void opengeode_geode_mesh_api convert_edged_curve_to_polydata(
        EdgedCurve< 2 > &, vtkPolyData * );
    template void opengeode_geode_mesh_api convert_edged_curve_to_polydata(
        EdgedCurve< 3 > &, vtkPolyData * );

} // namespace geode
