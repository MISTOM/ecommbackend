//approve a product

import { error, json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function PUT({ params, url, locals }) {
	//check if user is logged in
	if (!locals.user) return error(401, 'Unauthorized: You must be logged in to approve a product');
	// //check if user is a admin
	if (locals.user.role !== 3) return error(401, 'Unauthorized: You must be an admin to approve a product');



	const isApprove = url.searchParams.get('isApprove');
	const { id } = params;
	if (!id) return json({ message: 'Product ID not provided to approve' }, { status: 400 });

	const product = await prisma.product.findUnique({
		where: {
			id: Number(params.id)
		}
	});
	if (!product)
		return json({ message: 'Product to approve/disapprove not found' }, { status: 404 });

		try{

			if (isApprove === 'false') {
				
					console.log('disapproving');
		
					const result = await prisma.product.update({
						where: {
							id: Number(id)
						},
						data: {
							isApproved: false
						}
					});
					return json(result, { status: 200 });
			} else {
	
					console.log('approving');
					const result = await prisma.product.update({
						where: {
							id: Number(id)
						},
						data: {
							isApproved: true
						}
					});
					return json(result, { status: 200 });
			}

		} catch(e){
			console.log(e);
			return json(e, { status: 500 });
		}

	
}