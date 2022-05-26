using System.IO;
using System.Text;

namespace ZiZhuJY.Common.Services
{
    public class BackupService
    {
        public const string BackupFolderName = "Backup";

        public static string GetBackupDirectory()
        {
            return Path.Combine(Directory.GetCurrentDirectory(), BackupFolderName);
        }

        public static string GetBackupFullName(string fileName)
        {
            return Path.Combine(GetBackupDirectory(), fileName);
        }

        public static void SaveTextBackup(string fileName, string fileContent, Encoding encoding)
        {
            var fileFullName = GetBackupFullName(fileName);

            var directory = Path.GetDirectoryName(fileFullName);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            File.WriteAllText(fileFullName, fileContent, encoding);
        }

        public static void SaveTextBackup(string fileName, string fileContent)
        {
            SaveTextBackup(fileName, fileContent, Encoding.UTF8);
        }

        public static string ReadTextBackup(string fileName, Encoding encoding)
        {
            var fileFullName = GetBackupFullName(fileName);

            return File.ReadAllText(fileFullName, encoding);
        }

        public static string ReadTextBackup(string fileName)
        {
            return ReadTextBackup(fileName, Encoding.UTF8);
        }

        public static void SaveBinaryBackup(string fileName, byte[] contents)
        {
            var fileFullName = GetBackupFullName(fileName);

            var directory = Path.GetDirectoryName(fileFullName);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            File.WriteAllBytes(fileFullName, contents);
        }

        public static byte[] ReadBinaryBackup(string fileName)
        {
            var fileFullName = GetBackupFullName(fileName);

            return File.ReadAllBytes(fileFullName);
        }
    }
}
