import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
    constructor(
        @Inject(REQUEST)
        private readonly request: Request,
    ) {}

    public async paginateQuery<T extends ObjectLiteral>(
        paginationQuery: PaginationQueryDto,
        repository: Repository<T>,
    ): Promise<Paginated<T>> {
        let results = await repository.find({
            skip: (paginationQuery.page - 1) * paginationQuery.limit,
            take: paginationQuery.limit,
        });
        const baseUrl =
            this.request.protocol + '://' + this.request.headers.host + '/';
        const newUrl = new URL(this.request.url, baseUrl);

        console.log('Base URL:', baseUrl); // Debugging log
        console.log('New URL:', newUrl); // Debugging log

        const totalItems = await repository.count();
        const totalPages = Math.ceil(totalItems / paginationQuery.limit);
        const nextPage =
            paginationQuery.page < totalPages
                ? paginationQuery.page + 1
                : paginationQuery.page;
        const prevPage =
            paginationQuery.page > 1
                ? paginationQuery.page - 1
                : paginationQuery.page;

        const finalResponse: Paginated<T> = {
            data: results,
            meta: {
                totalItems,
                itemsPerPage: paginationQuery.limit,
                totalPages,
                currentPage: paginationQuery.page,
            },
            links: {
                first: `${newUrl.origin}${newUrl.pathname}?page=1&limit=${paginationQuery.limit}`,
                previous: `${newUrl.origin}${newUrl.pathname}?page=${prevPage}&limit=${paginationQuery.limit}`,
                next: `${newUrl.origin}${newUrl.pathname}?page=${nextPage}&limit=${paginationQuery.limit}`,
                last: `${newUrl.origin}${newUrl.pathname}?page=${totalPages}&limit=${paginationQuery.limit}`,
                current: `${newUrl.origin}${newUrl.pathname}?page=${paginationQuery.page}&limit=${paginationQuery.limit}`,
            },
        };
        return finalResponse;
    }
}
