import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddConcludedFieldToAppointments1591472218075
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'concluded',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'concluded');
  }
}
