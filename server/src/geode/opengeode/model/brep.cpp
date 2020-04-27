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

#include <geode/opengeode/model/brep.h>

#include <vtkPolyData.h>
#include <vtkXMLPolyDataWriter.h>

#include <geode/geometry/point.h>

#include <geode/mesh/core/edged_curve.h>

#include <geode/model/mixin/core/line.h>
#include <geode/model/representation/core/brep.h>

namespace geode
{
    std::string export_brep_lines( const BRep &brep )
    {
        index_t nb_points{ 0 };
        index_t nb_edges{ 0 };
        for( const auto &line : brep.lines() )
        {
            const auto &mesh = line.mesh();
            nb_points += mesh.nb_vertices();
            nb_edges += mesh.nb_edges();
        }

        vtkSmartPointer< vtkPoints > points = vtkPoints::New();
        points->Allocate( nb_points );
        vtkSmartPointer< vtkCellArray > edges = vtkCellArray::New();
        edges->AllocateExact( nb_edges, nb_edges * 2 );
        for( const auto &line : brep.lines() )
        {
            const auto offset = points->GetNumberOfPoints();
            const auto &mesh = line.mesh();
            for( const auto v : Range{ mesh.nb_vertices() } )
            {
                const auto &point = mesh.point( v );
                points->InsertNextPoint(
                    point.value( 0 ), point.value( 1 ), point.value( 2 ) );
            }
            for( const auto e : Range( mesh.nb_edges() ) )
            {
                edges->InsertNextCell( { offset + mesh.edge_vertex( { e, 0 } ),
                    offset + mesh.edge_vertex( { e, 1 } ) } );
            }
        }

        vtkSmartPointer< vtkPolyData > polydata = vtkPolyData::New();
        polydata->SetPoints( points );
        polydata->SetLines( edges );

        vtkSmartPointer< vtkXMLPolyDataWriter > writer =
            vtkXMLPolyDataWriter::New();
        writer->SetInputData( polydata );
        writer->WriteToOutputStringOn();
        writer->SetDataModeToBinary();
        writer->SetCompressorTypeToZLib();
        writer->Write();
        return writer->GetOutputString();
    }
} // namespace geode
