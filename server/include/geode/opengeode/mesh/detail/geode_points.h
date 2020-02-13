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

#include <vtkType.h>

#include <geode/geometry/point.h>

namespace geode
{
    namespace detail
    {
        template < template < index_t > class Mesh, index_t dimension >
        class GeodePoints : public vtkDataArray
        {
        public:
            GeodePoints( const Mesh< dimension > &mesh ) : mesh_( mesh )
            {
                SetNumberOfComponents( 3 );
                MaxId = mesh.nb_vertices() * 3 - 1;
            }

            vtkTypeBool Allocate(
                vtkIdType /*unused*/, vtkIdType /*unused*/ ) override
            {
                throw OpenGeodeException{ "Allocate not implemented" };
            }
            void Initialize() override
            {
                throw OpenGeodeException{ "Initialize not implemented" };
            }
            int GetDataType() const override
            {
                return vtkTypeTraits< double >::VTK_TYPE_ID;
            }
            int GetDataTypeSize() const override
            {
                throw OpenGeodeException{ "GetDataTypeSize not implemented" };
            }
            void SetNumberOfTuples( vtkIdType /*unused*/ ) override
            {
                throw OpenGeodeException{ "SetNumberOfTuples not implemented" };
            }
            void *GetVoidPointer( vtkIdType valueIdx ) override
            {
                return GetTuple( valueIdx );
            }
            void Squeeze() override
            {
                throw OpenGeodeException{ "Squeeze not implemented" };
            }
            vtkTypeBool Resize( vtkIdType /*unused*/ ) override
            {
                throw OpenGeodeException{ "Resize not implemented" };
            }
            void SetVoidArray( void * /*unused*/,
                vtkIdType /*unused*/,
                int /*unused*/ ) override
            {
                throw OpenGeodeException{ "SetVoidArray not implemented" };
            }
            void SetArrayFreeFunction( void ( * )( void * ) ) override
            {
                throw OpenGeodeException{
                    "SetArrayFreeFunction not implemented"
                };
            }
            vtkArrayIterator *NewIterator() override
            {
                throw OpenGeodeException{ "NewIterator not implemented" };
            }
            vtkIdType LookupValue( vtkVariant /*unused*/ ) override
            {
                throw OpenGeodeException{ "LookupValue not implemented" };
            }
            void LookupValue(
                vtkVariant /*unused*/, vtkIdList * /*unused*/ ) override
            {
                throw OpenGeodeException{ "LookupValue not implemented" };
            }
            void InsertVariantValue(
                vtkIdType /*unused*/, vtkVariant /*unused*/ ) override
            {
                throw OpenGeodeException{
                    "InsertVariantValue not implemented"
                };
            }
            void SetVariantValue(
                vtkIdType /*unused*/, vtkVariant /*unused*/ ) override
            {
                throw OpenGeodeException{ "SetVariantValue not implemented" };
            }
            void DataChanged() override
            {
                throw OpenGeodeException{ "DataChanged not implemented" };
            }
            void ClearLookup() override
            {
                throw OpenGeodeException{ "ClearLookup not implemented" };
            }
            double *GetTuple( vtkIdType tupleIdx ) override
            {
                throw OpenGeodeException{ "GetTuple not implemented" };
                const auto &const_point = mesh_.point( tupleIdx );
                auto &point = const_cast< Point< dimension > & >( const_point );
                return reinterpret_cast< double * >( &point );
            }
            void GetTuple( vtkIdType tupleIdx, double *tuple ) override
            {
                throw OpenGeodeException{ "GetTuple2 not implemented" };
                const auto &point = mesh_.point( tupleIdx );
                tuple[0] = point.value( 0 );
                tuple[1] = point.value( 1 );
                if( dimension == 3 )
                {
                    tuple[2] = point.value( 2 );
                }
                else
                {
                    tuple[2] = 0;
                }
            }
            double GetComponent( vtkIdType tupleIdx, int compIdx ) override
            {
                if( compIdx < dimension )
                {
                    return mesh_.point( tupleIdx ).value( compIdx );
                }
                return 0;
            }
            void InsertTuple(
                vtkIdType /*unused*/, const float * /*unused*/ ) override
            {
                throw OpenGeodeException{ "InsertTuple not implemented" };
            }
            void InsertTuple(
                vtkIdType /*unused*/, const double * /*unused*/ ) override
            {
                throw OpenGeodeException{ "InsertTuple not implemented" };
            }
            vtkIdType InsertNextTuple( const float * /*unused*/ ) override
            {
                throw OpenGeodeException{ "InsertNextTuple not implemented" };
            }
            vtkIdType InsertNextTuple( const double * /*unused*/ ) override
            {
                throw OpenGeodeException{ "InsertNextTuple not implemented" };
            }
            void RemoveTuple( vtkIdType /*unused*/ ) override
            {
                throw OpenGeodeException{ "RemoveTuple not implemented" };
            }
            void *WriteVoidPointer(
                vtkIdType /*unused*/, vtkIdType /*unused*/ ) override
            {
                throw OpenGeodeException{ "WriteVoidPointer not implemented" };
            }

        private:
            const Mesh< dimension > &mesh_;
        };
    } // namespace detail
} // namespace geode
