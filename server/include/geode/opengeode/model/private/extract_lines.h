/*
 * Copyright (c) 2019 - 2022 Geode-solutions
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

#pragma once

#include <geode/geometry/point.h>

#include <geode/mesh/builder/edged_curve_builder.h>
#include <geode/mesh/core/edged_curve.h>

#include <geode/model/mixin/core/line.h>

namespace geode
{
    namespace detail
    {
        template < index_t dimension, typename Model >
        std::unique_ptr< EdgedCurve< dimension > > export_model_lines(
            const Model &model )
        {
            index_t nb_points{ 0 };
            index_t nb_edges{ 0 };
            for( const auto &line : model.lines() )
            {
                const auto &mesh = line.mesh();
                nb_points += mesh.nb_vertices();
                nb_edges += mesh.nb_edges();
            }
            auto curve = EdgedCurve< dimension >::create();
            auto builder = EdgedCurveBuilder< dimension >::create( *curve );
            builder->create_vertices( nb_points );
            builder->create_edges( nb_edges );
            index_t offset_v{ 0 };
            index_t offset_e{ 0 };
            for( const auto &line : model.lines() )
            {
                const auto &mesh = line.mesh();
                for( const auto v : Range{ mesh.nb_vertices() } )
                {
                    builder->set_point( offset_v + v, mesh.point( v ) );
                }
                for( const auto e : Range{ mesh.nb_edges() } )
                {
                    builder->set_edge_vertex( { offset_e + e, 0 },
                        offset_v + mesh.edge_vertex( { e, 0 } ) );
                    builder->set_edge_vertex( { offset_e + e, 1 },
                        offset_v + mesh.edge_vertex( { e, 1 } ) );
                }
                offset_v += mesh.nb_vertices();
                offset_e += mesh.nb_vertices();
            }
            return curve;
        }
    } // namespace detail
} // namespace geode
