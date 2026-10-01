import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Class from '@/models/Class';
import Subject from '@/models/Subject';
import Material from '@/models/Material';
import Assignment from '@/models/Assignment';
import Quiz from '@/models/Quiz';
import Submission from '@/models/Submission';
import Grade from '@/models/Grade';
import Announcement from '@/models/Announcement';
import { requireRole } from '@/lib/auth';
import { fail, ok } from '@/lib/api';

export async function GET() {
  try {
    await requireRole(['admin', 'kepsek', 'kurikulum']);
  } catch {
    return fail('Tidak diizinkan', 403);
  }

  try {
    await connectDB();

    const [
      totalUsers,
      totalSiswa,
      totalGuru,
      totalKelas,
      totalMapel,
      totalMateri,
      totalTugas,
      totalQuiz,
      totalPengumuman,
      totalSubmission,
      totalGrade,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'siswa' }),
      User.countDocuments({ role: 'guru' }),
      Class.countDocuments(),
      Subject.countDocuments(),
      Material.countDocuments(),
      Assignment.countDocuments(),
      Quiz.countDocuments(),
      Announcement.countDocuments(),
      Submission.countDocuments(),
      Grade.countDocuments(),
    ]);

    // Rombel per tingkat/jurusan untuk chart batang
    const kelasAgg = await Class.aggregate([
      {
        $group: {
          _id: { level: '$level', major: '$major' },
          jumlah: { $sum: 1 },
        },
      },
      { $sort: { '_id.level': 1, '_id.major': 1 } },
    ]);

    // Sebaran user per role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', jumlah: { $sum: 1 } } },
      { $sort: { jumlah: -1 } },
    ]);

    // Nilai rata-rata per mata pelajaran
    const avgGradeBySubject = await Grade.aggregate([
      { $match: { final: { $exists: true } } },
      {
        $group: {
          _id: '$subjectId',
          rataRata: { $avg: '$final' },
          jumlah: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: '_id',
          as: 'subject',
        },
      },
      { $unwind: { path: '$subject', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          nama: { $ifNull: ['$subject.name', 'Tidak diketahui'] },
          kode: { $ifNull: ['$subject.code', '-'] },
          rataRata: { $round: ['$rataRata', 1] },
          jumlah: 1,
        },
      },
      { $sort: { rataRata: -1 } },
    ]);

    // Tren submission 7 hari terakhir
    const tujuhHariLalu = new Date();
    tujuhHariLalu.setDate(tujuhHariLalu.getDate() - 7);
    const submissionTrend = await Submission.aggregate([
      { $match: { createdAt: { $gte: tujuhHariLalu } } },
      {
        $group: {
          _id: { $dateToString: { format: '%d/%m', date: '$createdAt' } },
          jumlah: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Tugas yang belum ada submission-nya
    const tugasBelumDikumpulkan = await Assignment.countDocuments({
      _id: { $nin: await Submission.distinct('assignmentId') },
    });

    // 5 user terbaru
    const userTerbaru = await User.find()
      .select('name email role classId createdAt')
      .populate('classId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // 5 pengumuman terbaru
    const pengumumanTerbaru = await Announcement.find()
      .populate('authorId', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return ok({
      ringkasan: {
        totalUsers,
        totalSiswa,
        totalGuru,
        totalKelas,
        totalMapel,
        totalMateri,
        totalTugas,
        totalQuiz,
        totalPengumuman,
        totalSubmission,
        totalGrade,
      },
      usersByRole,
      kelasAgg,
      avgGradeBySubject,
      submissionTrend,
      tugasBelumDikumpulkan,
      userTerbaru,
      pengumumanTerbaru,
    });
  } catch (e) {
    console.error('Gagal ambil statistik admin:', e);
    return fail('Gagal mengambil statistik', 500);
  }
}
