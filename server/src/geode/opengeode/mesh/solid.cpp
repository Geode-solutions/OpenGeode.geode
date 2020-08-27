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

#include <geode/mesh/core/solid_mesh.h>

#include <geode/opengeode/mesh/detail/geode_points.h>
#include <geode/opengeode/mesh/detail/vtk_xml.h>

namespace geode
{
    template < index_t dimension >
    void convert_solid_to_polydata(
        SolidMesh< dimension > &mesh, vtkPolyData *polydata )
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

    template < index_t dimension >
    std::string opengeode_geode_mesh_api extract_solid_wireframe(
        SolidMesh< dimension > &mesh )
    {
        std::vector< bool > exported_vertex( mesh.nb_vertices(), false );
        std::vector< bool > exported_edge( mesh.nb_edges(), false );
        for( const auto p : Range{ mesh.nb_polyhedra() } )
        {
            for( const auto f : Range{ mesh.nb_polyhedron_facets( p ) } )
            {
                const PolyhedronFacet facet{ p, f };
                if( mesh.is_polyhedron_facet_on_border( facet ) )
                {
                    for( const auto v :
                        Range{ mesh.nb_polyhedron_facet_vertices( facet ) } )
                    {
                        exported_vertex[mesh.polyhedron_facet_vertex(
                            { facet, v } )] = true;
                        exported_edge[mesh.polyhedron_facet_edge( { facet, v } )
                                          .value()] = true;
                    }
                }
            }
        }
        const auto nb_points = absl::c_count( exported_vertex, true );
        const auto nb_edges = absl::c_count( exported_edge, true );

        vtkSmartPointer< vtkPoints > points = vtkPoints::New();
        points->Allocate( nb_points );
        vtkSmartPointer< vtkCellArray > edges = vtkCellArray::New();
        edges->AllocateExact( nb_edges, nb_edges * 2 );

        absl::flat_hash_map< index_t, index_t > vertices;
        vertices.reserve( nb_points );
        for( const auto v : Range{ mesh.nb_vertices() } )
        {
            if( exported_vertex[v] )
            {
                const auto &point = mesh.point( v );
                points->InsertNextPoint(
                    point.value( 0 ), point.value( 1 ), point.value( 2 ) );
                vertices.emplace( v, vertices.size() );
            }
        }

        for( const auto e : Range{ mesh.nb_edges() } )
        {
            if( exported_edge[e] )
            {
                const auto &edge_vertices = mesh.edge_vertices( e );
                edges->InsertNextCell( { vertices[edge_vertices[0]],
                    vertices[edge_vertices[1]] } );
            }
        }

        vtkSmartPointer< vtkPolyData > polydata = vtkPolyData::New();
        polydata->SetPoints( points );
        polydata->SetLines( edges );

        return detail::export_xml( polydata );
    }

    template std::string opengeode_geode_mesh_api extract_solid_wireframe(
        SolidMesh< 3 > & );

    template void opengeode_geode_mesh_api convert_solid_to_polydata(
        SolidMesh< 3 > &, vtkPolyData * );

} // namespace geode
